// Code generated by cue get go. DO NOT EDIT.

//cue:generate cue get go github.com/perses/perses/pkg/model/api/v1

package v1

import "github.com/perses/perses/cue/model/api/v1/secret"

#PublicSecretSpec: {
	basicAuth?: null | secret.#PublicBasicAuth @go(BasicAuth,*secret.PublicBasicAuth)

	// The HTTP authorization credentials for the targets.
	authorization?: null | secret.#PublicAuthorization @go(Authorization,*secret.PublicAuthorization)

	// The Oauth configuration for the targets.
	oauth?: null | secret.#PublicOAuth @go(OAuth,*secret.PublicOAuth)

	// TLSConfig to use to connect to the targets.
	tlsConfig?: null | secret.#PublicTLSConfig @go(TLSConfig,*secret.PublicTLSConfig)
}

#PublicGlobalSecret: {
	kind:     #Kind             @go(Kind)
	metadata: #Metadata         @go(Metadata)
	spec:     #PublicSecretSpec @go(Spec)
}

#PublicSecret: {
	kind:     #Kind             @go(Kind)
	metadata: #ProjectMetadata  @go(Metadata)
	spec:     #PublicSecretSpec @go(Spec)
}
