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

package crypto

import (
	"fmt"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"
	"github.com/perses/perses/pkg/model/api/config"
)

const (
	CookieKeyJWTPayload   = "jwtPayload"
	CookieKeyJWTSignature = "jwtSignature"
	CookieKeyRefreshToken = "jwtRefreshToken"
	cookiePath            = "/"
)

func signedToken(login string, notBefore time.Time, expireAt time.Time, key []byte) (string, error) {
	token := jwt.NewWithClaims(jwt.SigningMethodHS512, &jwt.RegisteredClaims{
		Subject:   login,
		ExpiresAt: jwt.NewNumericDate(expireAt),
		NotBefore: jwt.NewNumericDate(notBefore),
	})
	// The type of the key depends on the signature method.
	// See https://golang-jwt.github.io/jwt/usage/signing_methods/#signing-methods-and-key-types.
	return token.SignedString(key)
}

type JWT interface {
	SignedAccessToken(login string) (string, error)
	SignedRefreshToken(login string) (string, error)
	// CreateAccessTokenCookie will create two different cookies that contain a piece of the token.
	// As a reminder, a JWT token has the following structure: header.payload.signature
	// The first cookie will contain the struct header.payload that can then be manipulated by Javascript
	// The second cookie will contain the signature, and it won't be accessible by Javascript.
	CreateAccessTokenCookie(accessToken string) (*http.Cookie, *http.Cookie)
	DeleteAccessTokenCookie() (*http.Cookie, *http.Cookie)
	CreateRefreshTokenCookie(refreshToken string) *http.Cookie
	DeleteRefreshTokenCookie() *http.Cookie
	ValidateRefreshToken(token string) (*jwt.RegisteredClaims, error)
}

type jwtImpl struct {
	accessKey       []byte
	refreshKey      []byte
	accessTokenTTL  time.Duration
	refreshTokenTTL time.Duration
	cookieConfig    config.Cookie
}

func (j *jwtImpl) SignedAccessToken(login string) (string, error) {
	now := time.Now()
	return signedToken(login, now, now.Add(j.accessTokenTTL), j.accessKey)
}

func (j *jwtImpl) SignedRefreshToken(login string) (string, error) {
	now := time.Now()
	return signedToken(login, now, now.Add(j.refreshTokenTTL), j.refreshKey)
}

func (j *jwtImpl) CreateAccessTokenCookie(accessToken string) (*http.Cookie, *http.Cookie) {
	expireDate := time.Now().Add(j.accessTokenTTL)
	// On browsers, if the cooke age is expired, the cookie is not sent with the request and will return 400.
	// However, if we want to have the refresh token working with browsers, we need to have back returns status 401,
	// if the access token is expired, so we need to set the cookie with a max age even if the cookie is expired before.
	maxAge := max(int(j.accessTokenTTL.Seconds()), int(j.refreshTokenTTL.Seconds()))
	tokenSplit := strings.Split(accessToken, ".")
	headerPayloadCookie := &http.Cookie{
		Name:     CookieKeyJWTPayload,
		Value:    fmt.Sprintf("%s.%s", tokenSplit[0], tokenSplit[1]),
		Path:     cookiePath,
		MaxAge:   maxAge,
		Expires:  expireDate,
		Secure:   j.cookieConfig.Secure,
		HttpOnly: false,
		SameSite: http.SameSite(j.cookieConfig.SameSite),
	}
	signatureCookie := &http.Cookie{
		Name:     CookieKeyJWTSignature,
		Value:    tokenSplit[2],
		Path:     cookiePath,
		MaxAge:   maxAge,
		Expires:  expireDate,
		Secure:   j.cookieConfig.Secure,
		HttpOnly: true,
		SameSite: http.SameSite(j.cookieConfig.SameSite),
	}
	return headerPayloadCookie, signatureCookie
}

func (j *jwtImpl) DeleteAccessTokenCookie() (*http.Cookie, *http.Cookie) {
	headerPayloadCookie := &http.Cookie{
		Name:     CookieKeyJWTPayload,
		Value:    "",
		Path:     cookiePath,
		MaxAge:   -1,
		HttpOnly: false,
	}
	signatureCookie := &http.Cookie{
		Name:     CookieKeyJWTSignature,
		Value:    "",
		Path:     cookiePath,
		MaxAge:   -1,
		HttpOnly: true,
	}
	return headerPayloadCookie, signatureCookie
}

func (j *jwtImpl) CreateRefreshTokenCookie(refreshToken string) *http.Cookie {
	return &http.Cookie{
		Name:     CookieKeyRefreshToken,
		Value:    refreshToken,
		Path:     cookiePath,
		MaxAge:   int(j.refreshTokenTTL.Seconds()),
		Expires:  time.Now().Add(j.refreshTokenTTL),
		Secure:   j.cookieConfig.Secure,
		HttpOnly: true,
		SameSite: http.SameSite(j.cookieConfig.SameSite),
	}
}

func (j *jwtImpl) DeleteRefreshTokenCookie() *http.Cookie {
	return &http.Cookie{
		Name:     CookieKeyRefreshToken,
		Value:    "",
		Path:     cookiePath,
		MaxAge:   -1,
		HttpOnly: true,
	}
}

func (j *jwtImpl) ValidateRefreshToken(token string) (*jwt.RegisteredClaims, error) {
	parsedToken, err := jwt.ParseWithClaims(token, &jwt.RegisteredClaims{}, func(_ *jwt.Token) (interface{}, error) {
		return j.refreshKey, nil
	}, jwt.WithValidMethods([]string{jwt.SigningMethodHS512.Name}))
	if err != nil {
		return nil, err
	}
	return parsedToken.Claims.(*jwt.RegisteredClaims), nil
}
