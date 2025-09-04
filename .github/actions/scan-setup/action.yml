name: "Scan Setup"
description: "Checkout code, setup environment and artifact paths for SAST/SCA scans"
author: "Johan"
runs:
  using: "composite"
  steps:
    - name: Checkout Code
      uses: actions/checkout@v4
      with:
        fetch-depth: 0

    - name: Set Artifact Name
      run: echo "artifact-name=${{ inputs.artifact-name }}" >> $GITHUB_OUTPUT

    - name: Set Report Filename
      run: |
        if [[ "${{ inputs.scan-target }}" == "root" ]]; then
          REPORT_PATH="${{ inputs.scan-target }}-scan.json"
        else
          REPORT_PATH="${{ inputs.scan-target }}-scan.json"
        fi
        echo "report_filename=$REPORT_PATH" >> $GITHUB_OUTPUT

inputs:
  scan-target:
    description: 'Target to scan (frontend, backend, root)'
    required: true
    type: string
  artifact-name:
    description: 'Artifact name for the uploaded report'
    required: true
    type: string

outputs:
  artifact-name:
    description: 'Name of the artifact'
  report-filename:
    description: 'Path to the report file'
