#ifndef ENGINE_H
#define ENGINE_H

#include <SDL.h>
#include "../Graphics/Renderer.h"
#include "../Graphics/TextureManager.h"
#include "../Input/InputHandler.h"

class Engine {
public:
    Engine();
    ~Engine();

    bool init(const char* title, int width, int height, bool fullscreen);
    void handleEvents();
    void update_game_state();
    void render();
    void clean();
    bool running() const;

private:
    bool isRunning;
    SDL_Window* window;
    Renderer* renderer;
    TextureManager* textureManager;
    InputHandler* inputHandler;
};

#endif
