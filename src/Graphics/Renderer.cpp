#include "Renderer.h"

Renderer::Renderer(SDL_Window* window) {
    sdlRenderer = SDL_CreateRenderer(window, -1, SDL_RENDERER_ACCELERATED);
}

Renderer::~Renderer() {
    SDL_DestroyRenderer(sdlRenderer);
}

void Renderer::clear() {
    SDL_SetRenderDrawColor(sdlRenderer, 0, 0, 0, 255);
    SDL_RenderClear(sdlRenderer);
}

void Renderer::present() {
    SDL_RenderPresent(sdlRenderer);
}

SDL_Renderer* Renderer::getSDLRenderer() const {
    return sdlRenderer;
}
