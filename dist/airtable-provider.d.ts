type AirtableProviderOptions = {
    url: string;
    fetch: any;
    entity: Record<string, any>;
    debug: boolean;
};
declare function AirtableProvider(this: any, options: AirtableProviderOptions): {
    exports: {};
};
export default AirtableProvider;
