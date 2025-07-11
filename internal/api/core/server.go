// Copyright 2024 The Perses Authors
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
// http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

package core

import (
	"github.com/labstack/echo/v4"
	echoUtils "github.com/perses/common/echo"
	"github.com/perses/perses/internal/api/core/middleware"
	"github.com/perses/perses/internal/api/dependency"
	authendpoint "github.com/perses/perses/internal/api/impl/auth"
	configendpoint "github.com/perses/perses/internal/api/impl/config"
	migrateendpoint "github.com/perses/perses/internal/api/impl/migrate"
	"github.com/perses/perses/internal/api/impl/proxy"
	"github.com/perses/perses/internal/api/impl/v1/dashboard"
	"github.com/perses/perses/internal/api/impl/v1/datasource"
	"github.com/perses/perses/internal/api/impl/v1/ephemeraldashboard"
	"github.com/perses/perses/internal/api/impl/v1/folder"
	"github.com/perses/perses/internal/api/impl/v1/globaldatasource"
	"github.com/perses/perses/internal/api/impl/v1/globalrole"
	"github.com/perses/perses/internal/api/impl/v1/globalrolebinding"
	"github.com/perses/perses/internal/api/impl/v1/globalsecret"
	"github.com/perses/perses/internal/api/impl/v1/globalvariable"
	"github.com/perses/perses/internal/api/impl/v1/health"
	"github.com/perses/perses/internal/api/impl/v1/plugin"
	"github.com/perses/perses/internal/api/impl/v1/project"
	"github.com/perses/perses/internal/api/impl/v1/role"
	"github.com/perses/perses/internal/api/impl/v1/rolebinding"
	"github.com/perses/perses/internal/api/impl/v1/secret"
	"github.com/perses/perses/internal/api/impl/v1/user"
	"github.com/perses/perses/internal/api/impl/v1/variable"
	"github.com/perses/perses/internal/api/impl/v1/view"
	validateendpoint "github.com/perses/perses/internal/api/impl/validate"
	"github.com/perses/perses/internal/api/route"
	"github.com/perses/perses/internal/api/utils"
	"github.com/perses/perses/pkg/model/api/config"
	"github.com/sirupsen/logrus"
)

type api struct {
	echoUtils.Register
	apiV1Endpoints         []route.Endpoint
	apiEndpoints           []route.Endpoint
	proxyEndpoint          route.Endpoint
	authorizationMiddlware echo.MiddlewareFunc
	apiPrefix              string
}

func NewPersesAPI(serviceManager dependency.ServiceManager, persistenceManager dependency.PersistenceManager, cfg config.Config) echoUtils.Register {
	readonly := cfg.Security.Readonly
	caseSensitive := persistenceManager.GetPersesDAO().IsCaseSensitive()
	apiV1Endpoints := []route.Endpoint{
		dashboard.NewEndpoint(serviceManager.GetDashboard(), serviceManager.GetAuthorization(), readonly, caseSensitive),
		datasource.NewEndpoint(cfg.Datasource, serviceManager.GetDatasource(), serviceManager.GetAuthorization(), readonly, caseSensitive),
		ephemeraldashboard.NewEndpoint(serviceManager.GetEphemeralDashboard(), serviceManager.GetAuthorization(), readonly, caseSensitive, cfg.EphemeralDashboard.Enable),
		folder.NewEndpoint(serviceManager.GetFolder(), serviceManager.GetAuthorization(), readonly, caseSensitive),
		globaldatasource.NewEndpoint(cfg.Datasource, serviceManager.GetGlobalDatasource(), serviceManager.GetAuthorization(), readonly, caseSensitive),
		globalrole.NewEndpoint(serviceManager.GetGlobalRole(), serviceManager.GetAuthorization(), readonly, caseSensitive),
		globalrolebinding.NewEndpoint(serviceManager.GetGlobalRoleBinding(), serviceManager.GetAuthorization(), readonly, caseSensitive),
		globalsecret.NewEndpoint(serviceManager.GetGlobalSecret(), serviceManager.GetAuthorization(), readonly, caseSensitive),
		globalvariable.NewEndpoint(cfg.Variable, serviceManager.GetGlobalVariable(), serviceManager.GetAuthorization(), readonly, caseSensitive),
		health.NewEndpoint(serviceManager.GetHealth()),
		plugin.NewEndpoint(serviceManager.GetPlugin(), cfg.Plugin.EnableDev),
		project.NewEndpoint(serviceManager.GetProject(), serviceManager.GetAuthorization(), readonly, caseSensitive),
		role.NewEndpoint(serviceManager.GetRole(), serviceManager.GetAuthorization(), readonly, caseSensitive),
		rolebinding.NewEndpoint(serviceManager.GetRoleBinding(), serviceManager.GetAuthorization(), readonly, caseSensitive),
		secret.NewEndpoint(serviceManager.GetSecret(), serviceManager.GetAuthorization(), readonly, caseSensitive),
		user.NewEndpoint(serviceManager.GetUser(), serviceManager.GetAuthorization(), cfg.Security.Authentication.DisableSignUp, readonly, caseSensitive),
		variable.NewEndpoint(cfg.Variable, serviceManager.GetVariable(), serviceManager.GetAuthorization(), readonly, caseSensitive),
		view.NewEndpoint(serviceManager.GetView(), serviceManager.GetAuthorization(), serviceManager.GetDashboard()),
	}

	authEndpoint, err := authendpoint.New(
		persistenceManager.GetUser(),
		serviceManager.GetJWT(),
		serviceManager.GetAuthorization(),
		cfg.Security.Authentication.Providers,
		cfg.Security.EnableAuth,
	)
	if err != nil {
		logrus.WithError(err).Fatal("error initializing authentication endpoints")
	}
	apiEndpoints := []route.Endpoint{
		configendpoint.New(cfg),
		migrateendpoint.New(serviceManager.GetMigration()),
		validateendpoint.New(serviceManager.GetSchema(), serviceManager.GetDashboard()),
		authEndpoint,
	}
	return &api{
		apiV1Endpoints: apiV1Endpoints,
		apiEndpoints:   apiEndpoints,
		proxyEndpoint: proxy.New(cfg.Datasource, persistenceManager.GetDashboard(), persistenceManager.GetSecret(), persistenceManager.GetGlobalSecret(),
			persistenceManager.GetDatasource(), persistenceManager.GetGlobalDatasource(), serviceManager.GetCrypto(), serviceManager.GetAuthorization()),
		authorizationMiddlware: serviceManager.GetAuthorization().Middleware(func(_ echo.Context) bool {
			return !cfg.Security.EnableAuth
		}),
		apiPrefix: cfg.APIPrefix,
	}
}

func (a *api) RegisterRoute(e *echo.Echo) {
	// First, let's collect every route.
	// The expecting result is a tree we will need to loop over.
	groups := a.collectRoutes()
	// Now let's create a simple struct that will help us to loop over the route tree.
	type queueElement struct {
		parent *echo.Group
		group  *route.Group
	}
	var queue []queueElement
	for _, g := range groups {
		queue = append(queue, queueElement{group: g})
	}
	// It is our current element on each iteration.
	var el queueElement
	for len(queue) > 0 {
		// Let's grab the first element of the queue and remove it so the size of the queue is decreasing.
		el, queue = queue[0], queue[1:]
		// Now we need to initialize the echo group that will be used to finally register in the router the different route.
		var group *echo.Group
		if el.parent != nil {
			// The group can be created in a chain.
			// That's why if there is a group parent, we need to use it to create the new current group
			group = el.parent.Group(el.group.Path, el.group.Middlewares...)
		} else {
			group = e.Group(el.group.Path, el.group.Middlewares...)
		}
		// Then let's collect every child group, so we can loop over them during a future iteration.
		for _, g := range el.group.Groups {
			queue = append(queue, queueElement{group: g, parent: group})
		}
		// Finally, register the route with the echo.Group previously created.
		// We will consider also if the route needs to remain anonymous or not and then inject the JWT middleware accordingly.
		for _, rte := range el.group.Routes {
			mdws := []echo.MiddlewareFunc{middleware.HandleAnonymous(rte.IsAnonymous)}
			if !rte.IsAnonymous {
				mdws = append(mdws, a.authorizationMiddlware)
			}
			mdws = append(mdws, rte.Middlewares...)
			rte.Register(group, mdws...)
		}
	}
}

func (a *api) collectRoutes() []*route.Group {
	apiGroup := &route.Group{Path: a.apiPrefix + utils.APIPrefix}
	for _, ept := range a.apiEndpoints {
		ept.CollectRoutes(apiGroup)
	}
	apiV1Group := &route.Group{Path: a.apiPrefix + utils.APIV1Prefix}
	for _, ept := range a.apiV1Endpoints {
		ept.CollectRoutes(apiV1Group)
	}
	proxyGroup := &route.Group{Path: a.apiPrefix + "/proxy"}
	a.proxyEndpoint.CollectRoutes(proxyGroup)
	return []*route.Group{apiGroup, apiV1Group, proxyGroup}
}
