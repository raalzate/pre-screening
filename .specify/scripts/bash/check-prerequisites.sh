#!/bin/bash

# check-prerequisites.sh
# Mocks the behavior expected by Spec-Kit workflows

JSON_MODE=false
REQUIRE_TASKS=false
INCLUDE_TASKS=false

while [[ "$#" -gt 0 ]]; do
    case $1 in
        --json) JSON_MODE=true ;;
        --require-tasks) REQUIRE_TASKS=true ;;
        --include-tasks) INCLUDE_TASKS=true ;;
    esac
    shift
done

# For now, we assume the feature directory is the root for simple projects, 
# or we look for a specific folder if provided in arguments.
FEATURE_DIR="."
AVAILABLE_DOCS=()

if [ -f "spec.md" ]; then AVAILABLE_DOCS+=("spec.md"); fi
if [ -f "plan.md" ]; then AVAILABLE_DOCS+=("plan.md"); fi
if [ -f "tasks.md" ]; then AVAILABLE_DOCS+=("tasks.md"); fi

if [ "$JSON_MODE" = true ]; then
    echo "{\"FEATURE_DIR\": \"$FEATURE_DIR\", \"AVAILABLE_DOCS\": [$(printf "\"%s\"," "${AVAILABLE_DOCS[@]}" | sed 's/,$//')]}"
else
    echo "Found docs: ${AVAILABLE_DOCS[*]}"
fi
