ma# TODO: Improve Clothing Fit, Texture, Animation, and Loading

## 1. Adjust Clothing Positions for Proper Fit
- [x] Update Compression.js: Adjust position from [0, 1.401, 0.052] to [0, 0.285, 0] and scale to [0.537, 0.613, 0.468] for better fit
- [x] Update Racerback.js: Adjust position from [0, 1.402, 0.05] to [0, 0.285, 0] and scale to [0.507, 0.667, 0.457]
- [x] Update Stringer.js: Adjust position from [0, 1.314, 0.049] to [0, 0.285, 0] and scale to [0.561, 0.571, 0.51]

## 2. Improve Texture to High-Quality Sport Lycra
- [x] Update ThreeClothViewer.js: Adjust clothMaterialRef properties for lycra look (roughness: 0.4, metalness: 0.02, envMapIntensity: 0.4)

## 3. Add Movement Animation to Clothing
- [x] Update ThreeClothViewer.js: Add subtle oscillation animation to clothing group using useFrame

## 4. Implement Punctual Loader for Garment Changes
- [ ] Update ThreeClothViewer.js: Add clothingLoading state and show loader during clothing changes
- [ ] Update ThreeClothViewer.js: Dispatch 'clothing-loading' event and handle in loader logic
