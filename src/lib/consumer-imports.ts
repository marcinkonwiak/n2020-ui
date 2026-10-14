/**
 * Registry files import each other through the registry alias. A consumer
 * has the same files under the default shadcn aliases.
 */
export function withConsumerImports(source: string, registryName: string) {
  return source
    .replaceAll(`@/registry/${registryName}/ui/`, "@/components/ui/")
    .replaceAll(`@/registry/${registryName}/`, "@/")
    .trimEnd();
}
