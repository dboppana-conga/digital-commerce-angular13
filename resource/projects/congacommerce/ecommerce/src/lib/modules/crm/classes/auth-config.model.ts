import { Expose, Type } from 'class-transformer';
import { ATable, AObject } from '@congacommerce/core';
@ATable({
    sobjectName: 'AuthConfig'
})
export class AuthConfig extends AObject {

    @Expose({ name: 'Url' })
    Url: string = null;

    @Expose({ name: 'AuthOptionsSaml' })
    AuthOptionsSaml: boolean = null;

    @Expose({ name: 'AuthOptionsAuthProvider' })
    AuthOptionsAuthProvider: boolean = null;

    @Expose({ name: 'AuthOptionsCertificate' })
    AuthOptionsCertificate: boolean = null;

    @Expose({ name: 'AuthOptionsUsernamePassword' })
    AuthOptionsUsernamePassword: boolean = null;

    @Expose({ name: 'AuthProvidersForConfig' })
    @Type(() => AuthConfigProviders)
    AuthProvidersForConfig: Array<AuthConfigProviders> = null;
}

@ATable({
    sobjectName: 'AuthConfigProviders'
})
export class AuthConfigProviders extends AObject {

    @Expose({ name: 'AuthProvider' })
    @Type(() => SamlSSOConfig)
    AuthProvider: SamlSSOConfig = null;
}

@ATable({
    sobjectName: 'SamlSsoConfig',
    defaultFields: false
})
export class SamlSSOConfig extends AObject {

    @Expose({ name: 'Name' })
    Name: string = null;
}