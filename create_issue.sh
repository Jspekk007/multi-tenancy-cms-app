#!/bin/bash
set -euo pipefail

CSV_FILE="github_issues.csv"

# Read CSV safely using Python and produce one JSON object per row
python3 - <<EOF | while read -r issue; do
import csv, json
with open("$CSV_FILE", newline='') as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(json.dumps(row))
EOF

    # Extract fields from JSON
    title=$(echo "$issue" | jq -r '.title')
    body=$(echo "$issue" | jq -r '.body')
    labels=$(echo "$issue" | jq -r '.labels')

    echo "📌 Creating issue: $title with labels: $labels"

    # Handle multiple labels (comma-separated), trim spaces, ignore empty
    label_args=()
    IFS=',' read -ra arr <<< "$labels"
    for l in "${arr[@]}"; do
        l=$(echo "$l" | xargs)
        if [[ -n "$l" ]]; then
            label_args+=(--label "$l")
        fi
    done

    # Create GitHub issue
    gh issue create \
        --title "$title" \
        --body "$body" \
        "${label_args[@]}"

done
