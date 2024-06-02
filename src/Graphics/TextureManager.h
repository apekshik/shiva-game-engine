#ifndef TEXTUREMANAGER_H
#define TEXTUREMANAGER_H

#include <SDL.h>
#include <SDL_image.h>
#include <string>
#include <map>

class TextureManager {
public:
    TextureManager(SDL_Renderer* renderer);
    ~TextureManager();

    bool loadTexture(const std::string& fileName, const std::string& id);
    void unloadTexture(const std::string& id);
    void draw(const std::string& id, int x, int y, int width, int height);
    void drawFrame(const std::string& id, int x, int y, int width, int height, int currentRow, int currentFrame);

private:
    SDL_Renderer* sdlRenderer;
    std::map<std::string, SDL_Texture*> textureMap;
};

#endif
