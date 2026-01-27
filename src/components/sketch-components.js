// Component mapping configuration for sketch pages
export const sketchComponents = {
    CoalescingText: () => import('/src/components/CoalescingText.svelte'),
    PolygonOrCircle: () => import('/src/components/PolygonOrCircle.svelte'),
    DirectEtymologies: () => import('/src/components/DirectEtymologies.svelte'),
    ChildhoodDictionary: () => import('/src/components/ChildhoodDictionary.svelte'),
    LineDrawings: () => import('/src/components/LineDrawings.svelte'),
    ImageSampling: () => import('/src/components/ImageSampling.svelte'),
    IslandPeakscapes: () => import('/src/components/IslandPeakscapes.svelte'),
    CistercianCiphers: () => import('/src/components/CistercianCiphers.svelte'),
    ClimbingTrees: () => import('/src/components/ClimbingTrees.svelte'),
    RisingTemperature: () => import('/src/components/RisingTemperature.svelte')
}; 