import { DatasourcePlugin } from '@perses-dev/plugin-system';
import { TempoClient } from './src/model/tempo-client';
export interface TempoDatasourceSpec {
    direct_url?: string;
}
export declare const TempoDatasource: DatasourcePlugin<TempoDatasourceSpec, TempoClient>;
//# sourceMappingURL=TempoDataSource.d.ts.map