name: Feature Request
description: Suggest a new feature
title: "[FEATURE] "
labels: ["enhancement"]

body:
  - type: markdown
    attributes:
      value: |
        Thank you for your feature request! Help us understand what you'd like to add.

  - type: textarea
    id: description
    attributes:
      label: Description
      description: Clear description of the feature
    validations:
      required: true

  - type: textarea
    id: problem
    attributes:
      label: Problem it solves
      description: What problem does this feature solve?
    validations:
      required: true

  - type: textarea
    id: implementation
    attributes:
      label: Proposed Implementation
      description: How should this feature be implemented?

  - type: textarea
    id: benefits
    attributes:
      label: Benefits
      description: What are the benefits of this feature?

  - type: checkboxes
    id: checklist
    attributes:
      label: Checklist
      options:
        - label: This feature doesn't already exist
          required: true
        - label: I have searched similar requests
          required: true
