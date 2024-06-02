#include "TextureManager.h"

TextureManager::TextureManager(SDL_Renderer* renderer) : sdlRenderer(renderer) {}

TextureManager::~TextureManager() {
    for (auto& texturePair : textureMap) {
        SDL_DestroyTexture(texturePair.second);
    }
    textureMap.clear();
}

bool TextureManager::loadTexture(const std::string& fileName, const std::string& id) {
    SDL_Texture* texture = IMG_LoadTexture(sdlRenderer, fileName.c_str());
    if (texture == nullptr) {
        SDL_Log("Failed to load texture %s: %s", fileName.c_str(), SDL_GetError());
        return false;
    }
    textureMap[id] = texture;
    return true;
}

void TextureManager::unloadTexture(const std::string& id) {
    if (textureMap[id]) {
        SDL_DestroyTexture(textureMap[id]);
        textureMap.erase(id);
    }
}

void TextureManager::draw(const std::string& id, int x, int y, int width, int height) {
    SDL_Rect srcRect = { 0, 0, width, height };
    SDL_Rect destRect = { x, y, width, height };
    SDL_RenderCopy(sdlRenderer, textureMap[id], &srcRect, &destRect);
}

void TextureManager::drawFrame(const std::string& id, int x, int y, int width, int height, int currentRow, int currentFrame) {
    SDL_Rect srcRect = { width * currentFrame, height * (currentRow - 1), width, height };
    SDL_Rect destRect = { x, y, width, height };
    SDL_RenderCopy(sdlRenderer, textureMap[id], &srcRect, &destRect);
}
