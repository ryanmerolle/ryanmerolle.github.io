.PHONY: help list prek rumdl yamllint codespell hugo docker serve lint clean validate validate-html validate-links validate-css validate-rss plugins

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

.PHONY: help prek rumdl yamllint codespell lint hugo docker serve clean validate validate-html validate-links validate-css validate-rss plugins

##@ Validation

plugins: ## Install required validation tools locally
	@echo "Installing W3C validation dependencies..."
	@sudo apt-get update && sudo apt-get install -y default-jre wget npm nodejs
	@mkdir -p bin
	@if [ ! -f bin/vnu.jar ]; then wget -qO bin/vnu.jar "https://github.com/validator/validator/releases/download/latest/vnu.jar"; fi
	@if [ ! -f bin/muffet ]; then wget -qO- "https://github.com/raviqqe/muffet/releases/download/v2.11.2/muffet_linux_$$(dpkg --print-architecture).tar.gz" | tar -xz -C bin muffet; fi

validate: validate-html validate-links ## Run all local validation checks

validate-html: ## Run W3C Nu HTML Checker
	@echo 'Validating HTML...'
	hugo --minify
	@if [ ! -f bin/vnu.jar ]; then echo "Error: bin/vnu.jar not found. Run 'make plugins' first."; exit 1; fi
	find public -type f -name "*.html" -exec java -jar bin/vnu.jar --errors-only {} \+

validate-links: ## Run link checker
	@echo 'Checking links...'
	@if [ ! -f bin/muffet ]; then echo "Error: bin/muffet not found. Run 'make plugins' first."; exit 1; fi
	@hugo serve --port 1313 > /dev/null 2>&1 & \
		HUGO_PID=$$!; \
		sleep 3; \
		./bin/muffet \
			--buffer-size 8192 \
			--exclude 'linkedin\.com|twitter\.com|medium\.com|hashnode\.dev|bloomberg\.com|cloudflare\.com' \
			http://localhost:1313; \
		MUFFET_EXIT=$$?; \
		kill $$HUGO_PID 2>/dev/null; \
		exit $$MUFFET_EXIT

