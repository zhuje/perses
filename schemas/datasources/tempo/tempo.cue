// Copyright 2023 The Perses Authors
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

package model

import (
	"github.com/perses/perses/schemas/common"
	commonProxy "github.com/perses/perses/schemas/common/proxy"
)

kind: "TempoDatasource"
spec: {
	#directUrl | #proxy
	scrapeInterval?: =~"^(?:(\\d+)y)?(?:(\\d+)w)?(?:(\\d+)d)?(?:(\\d+)h)?(?:(\\d+)m)?(?:(\\d+)s)?(?:(\\d+)ms)?$"
}

#directUrl: {
	directUrl: common.#url
}

#proxy: {
	proxy: commonProxy.#HTTPProxy
}