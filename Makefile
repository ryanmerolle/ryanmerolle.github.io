.PHONY: help list prek rumdl yamllint codespell hugo docker serve lint clean

# Default target - show help
.DEFAULT_GOAL := help

# ANSI color codes for output
BOLD := \033[1m
BLUE := \033[36m
GREEN := \033[32m
MAGENTA := \033[35m
RESET := \033[0m

##@ General

help: ## Display this help message
	@printf '$(BOLD)Usage:$(RESET)\n'
	@printf '  make $(BOLD)<target>$(RESET)\n\n'
	@awk 'BEGIN { FS = ":.*##"; section = 0 } /^##@ / { if (section) printf "\n"; section = 1; gsub(/^##@ /, "", $$0); printf "$(BOLD)$(MAGENTA)%s$(RESET)\n", $$0; next } /^[a-zA-Z_-]+:.*## / { printf "  $(GREEN)%-18s$(RESET) %s\n", $$1, $$2 }' $(MAKEFILE_LIST)

list: help ## Alias for help

##@ Linting & Code Quality

prek: ## Run prek formatter on all files
	@echo 'Running prek...'
	prek run --all-files

rumdl: ## Check Ruby markdown linting
	@echo 'Checking Markdown with rumdl...'
	rumdl check .

yamllint: ## Lint YAML files
	@echo 'Linting YAML files...'
	yamllint .

codespell: ## Check for common spelling mistakes
	@echo 'Running codespell...'
	codespell .

lint: prek rumdl yamllint codespell ## Run all linting checks

##@ Development Server

hugo: ## Run Hugo development server
	@echo 'Starting Hugo dev server on http://localhost:1313'
	hugo serve --bind 0.0.0.0 --buildDrafts --buildFuture --disableFastRender

docker: ## Start Docker Compose services
	@echo 'Starting Docker Compose...'
	docker compose up

serve: docker ## Alias for docker (start development server via Docker)

##@ Utilities

clean: ## Clean build artifacts
	@echo 'Cleaning build artifacts...'
	rm -rf resources/ public/ .rumdl_cache/

.PHONY: help prek rumdl yamllint codespell lint hugo docker serve clean
