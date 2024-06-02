#include "Engine.h"

Engine::Engine() : isRunning(false), window(nullptr), renderer(nullptr), textureManager(nullptr), inputHandler(nullptr) {}

Engine::~Engine() {
    clean();
}

bool Engine::init(const char* title, int width, int height, bool fullscreen) {
    int flags = fullscreen ? SDL_WINDOW_FULLSCREEN : 0;

    if (SDL_Init(SDL_INIT_EVERYTHING) != 0) {
        SDL_Log("Failed to initialize SDL: %s", SDL_GetError());
        return false;
    }

    window = SDL_CreateWindow(title, SDL_WINDOWPOS_CENTERED, SDL_WINDOWPOS_CENTERED, width, height, flags);
    if (window == nullptr) {
        SDL_Log("Failed to create window: %s", SDL_GetError());
        return false;
    }

    renderer = new Renderer(window);
    textureManager = new TextureManager(renderer->getSDLRenderer());
    inputHandler = new InputHandler();

    // Load a texture for testing
    if (!textureManager->loadTexture("assets/images/grass.png", "grass")) {
        SDL_Log("Failed to load texture: %s", SDL_GetError());
        return false;
    }

    isRunning = true;
    return true;
}

void Engine::handleEvents() {
    inputHandler->update();
    if (inputHandler->isKeyPressed(SDLK_ESCAPE)) {
        isRunning = false;
    }
}

void Engine::update_game_state() {
    // Update game logic
}

void Engine::render() {
    renderer->clear();
    // Render game objects
    textureManager->draw("grass", 100, 100, 64, 64);
    renderer->present();
}

void Engine::clean() {
    delete textureManager;
    delete inputHandler;
    delete renderer;
    SDL_DestroyWindow(window);
    SDL_Quit();
}

bool Engine::running() const {
    return isRunning;
}
