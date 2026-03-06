name: Bug Report
description: Report a bug to help us improve
title: "[BUG] "
labels: ["bug"]
assignees: ["Aumaodh"]

body:
  - type: markdown
    attributes:
      value: |
        Thank you for reporting a bug! Please provide detailed information to help us fix it.

  - type: textarea
    id: description
    attributes:
      label: Description
      description: Clear description of what the bug is
    validations:
      required: true

  - type: textarea
    id: steps
    attributes:
      label: Steps to Reproduce
      description: How to reproduce the issue
      placeholder: |
        1. Go to '...'
        2. Click on '...'
        3. See error
    validations:
      required: true

  - type: textarea
    id: expected
    attributes:
      label: Expected Behavior
      description: What should happen instead
    validations:
      required: true

  - type: textarea
    id: actual
    attributes:
      label: Actual Behavior
      description: What actually happens
    validations:
      required: true

  - type: textarea
    id: environment
    attributes:
      label: Environment
      description: Your environment details
      placeholder: |
        - OS: Ubuntu 24.04
        - Node: 18.x
        - Browser: Chrome
        - Docker: Yes/No

  - type: textarea
    id: logs
    attributes:
      label: Error Logs
      description: Any error messages or logs
      render: shell

  - type: checkboxes
    id: checklist
    attributes:
      label: Checklist
      options:
        - label: I have searched existing issues
          required: true
        - label: I am using the latest version
          required: true
