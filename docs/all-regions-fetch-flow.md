# All Regions Fetch Flow (Pokédex)

This diagram explains how the "All Regions" data fetching logic works in the Pokédex app. It shows the flow from the user's region selection through paginated batch fetching and user-triggered loading of additional batches.

```mermaid
flowchart TD
    A[User selects All Regions] --> B[fetchPokemonList All Regions]
    B --> C[resetAllRegionsState]
    C --> D[setPokemonList empty]
    D --> E[fetchAllRegionsPage 0]
    E --> F{Already fetched offset?}
    F -- Yes --> G[Return skip fetch]
    F -- No --> H[fetchWithCache summary]
    H --> I[Get names from summary]
    I --> J[fetchDetailsBatch names]
    J --> K[Filter out id greater than 1025]
    K --> L{Any id equals 1025?}
    L -- Yes --> M[setAllRegionsHasMore false]
    L -- No --> N[Continue]
    K --> O[Add offset to summaryOffsets]
    O --> P[setPokemonList deduplicate by id]
    P --> Q{summary.next exists?}
    Q -- No --> R[setAllRegionsHasMore false]
    Q -- Yes --> S[Wait for user to trigger fetchNextAllRegionsPage]
    S --> T[fetchAllRegionsPage nextOffset]
    T --> F

    subgraph User Interaction
      S
      T
    end
```
