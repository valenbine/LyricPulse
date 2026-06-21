# Requirements Document

## Introduction

Template Customization adds a template management workflow to LyricPulse. Creators can tune visual parameters, drag visual objects on the preview canvas, enter numeric position and size values, persist custom templates on the server, and import or export template definitions as JSON.

## Glossary

- **LyricPulse**: The dynamic lyric video generation system.
- **Studio**: The browser-based workspace where creators upload assets, configure templates, preview video, and start rendering.
- **Template**: A Remotion composition that renders a lyric video visual style.
- **Built-in Template**: A template shipped with LyricPulse source code.
- **Custom Template**: A creator-managed template derived from a built-in template with saved settings.
- **Template Preset**: A saved set of configurable visual settings for one template base.
- **Editable Object**: A template element that exposes position, size, and style controls, such as title, artist, lyric group, cover, background, or spectrum.
- **Canvas Editor**: The Studio editor area that supports preview-based drag control for editable objects.
- **Numeric Inspector**: The Studio panel that edits numeric x, y, width, height, scale, rotation, opacity, and typography values.
- **Template JSON**: A serializable template definition containing metadata, base template reference, editable object settings, theme settings, and version information.
- **Published Template**: A template that appears in the Studio template picker for normal project creation.
- **Unpublished Template**: A template that remains editable in Admin and is hidden from the Studio template picker.
- **Recycle Bin**: The Admin area that lists soft-deleted templates and supports restore or permanent deletion.

## Requirements

### Requirement 1: Template Management

**User Story:** AS a creator, I want to manage built-in templates and custom templates, so that I can reuse visual styles across lyric video projects.

#### Acceptance Criteria

1. WHEN the creator opens the template manager, LyricPulse SHALL display built-in templates and saved custom templates.
2. WHEN the creator selects a built-in template, LyricPulse SHALL allow the creator to create a custom template from the selected built-in template.
3. WHEN the creator selects a custom template, LyricPulse SHALL display template metadata including name, description, base template, ratio support, and last updated time.
4. WHEN the creator renames or updates a custom template description, LyricPulse SHALL persist the updated metadata on the server.
5. IF a custom template references an unavailable built-in template, LyricPulse SHALL show a recoverable compatibility message.

### Requirement 2: Parameter Editing

**User Story:** AS a creator, I want to adjust template parameters, so that I can control typography, colors, object visibility, and motion intensity.

#### Acceptance Criteria

1. WHEN a custom template is open in the editor, LyricPulse SHALL display editable controls for colors, font family, font size, object opacity, object visibility, background intensity, lyric emphasis, and spectrum visibility.
2. WHEN the creator changes a parameter control, LyricPulse SHALL update the preview using the changed value.
3. WHEN the creator saves parameter changes, LyricPulse SHALL persist the changed values on the server.
4. IF a parameter value is outside the supported range, LyricPulse SHALL show the supported range and keep the last valid value.
5. WHEN a custom template is used for rendering, LyricPulse SHALL pass saved parameter values to the video renderer.

### Requirement 3: Drag And Numeric Layout Editing

**User Story:** AS a creator, I want to drag objects and edit numeric coordinates and sizes, so that I can precisely place title, lyrics, cover, and visual elements.

#### Acceptance Criteria

1. WHEN the creator selects an editable object on the canvas, LyricPulse SHALL show drag handles and inspector fields for x, y, width, height, scale, rotation, and opacity.
2. WHILE the creator drags an editable object, LyricPulse SHALL update the object's x and y values in the preview.
3. WHEN the creator edits x, y, width, or height in the numeric inspector, LyricPulse SHALL update the object's canvas position or size.
4. WHEN the creator saves layout changes, LyricPulse SHALL persist layout values per output ratio.
5. IF an edited object exceeds the safe canvas area, LyricPulse SHALL show an overflow warning and keep the creator's editable value.

### Requirement 4: Server Persistence

**User Story:** AS a creator, I want custom templates saved on the server, so that template presets remain available across sessions and projects.

#### Acceptance Criteria

1. WHEN the creator saves a custom template, LyricPulse SHALL store the custom template definition on the server.
2. WHEN the Studio loads, LyricPulse SHALL fetch saved custom templates from the server.
3. WHEN a custom template is applied to a project, LyricPulse SHALL store the custom template identifier and resolved template settings in the project configuration.
4. WHEN a saved custom template changes after a project has used the custom template, LyricPulse SHALL preserve the project's resolved settings until the creator applies the updated template.
5. IF the server cannot save a custom template, LyricPulse SHALL keep the unsaved draft in the Studio state and show a save failure message.

### Requirement 5: JSON Import And Export

**User Story:** AS a creator, I want to import and export custom templates as JSON, so that I can back up, share, and restore template presets.

#### Acceptance Criteria

1. WHEN the creator exports a custom template, LyricPulse SHALL download a Template JSON file containing metadata, base template, ratio-specific layout, parameter values, and schema version.
2. WHEN the creator imports a Template JSON file, LyricPulse SHALL validate the schema version and required fields.
3. IF the imported Template JSON is valid, LyricPulse SHALL create or update a custom template on the server based on the imported definition.
4. IF the imported Template JSON is invalid, LyricPulse SHALL show validation errors without modifying saved templates.
5. WHEN a Template JSON uses an older supported schema version, LyricPulse SHALL migrate the imported definition to the current schema version before saving.

### Requirement 6: Preview And Rendering Consistency

**User Story:** AS a creator, I want custom template preview and export to match, so that the rendered MP4 reflects editor changes.

#### Acceptance Criteria

1. WHEN a custom template is previewed, LyricPulse SHALL apply the same resolved template settings used by export.
2. WHEN a custom template is rendered, LyricPulse SHALL apply ratio-specific layout values for the selected output ratio.
3. WHEN the creator changes a setting in the editor, LyricPulse SHALL render the preview from the current draft settings.
4. IF a custom template setting is missing, LyricPulse SHALL use the base template's default setting for that field.
5. WHEN the exported MP4 completes, LyricPulse SHALL associate the render job with the template identifier and resolved settings used for export.

### Requirement 7: Template Publishing Workflow

**User Story:** AS an administrator, I want to publish and unpublish templates, so that Studio users only choose approved templates.

#### Acceptance Criteria

1. WHEN an administrator opens Admin, LyricPulse SHALL display template status for built-in templates and custom templates.
2. WHEN an administrator publishes a template, LyricPulse SHALL make the template available in the Studio template picker.
3. WHEN an administrator unpublishes a template, LyricPulse SHALL hide the template from the Studio template picker while keeping the template editable in Admin.
4. WHEN a project already references an unpublished template, LyricPulse SHALL keep the existing project preview and render path available for that project.
5. IF an administrator changes template status, LyricPulse SHALL persist the status on the server.

### Requirement 8: Recycle Bin And Deletion

**User Story:** AS an administrator, I want deleted templates to enter a recycle bin before permanent removal, so that accidental deletion can be recovered.

#### Acceptance Criteria

1. WHEN an administrator deletes a template from the active template list, LyricPulse SHALL soft-delete the template and move the template to the recycle bin.
2. WHILE a template is in the recycle bin, LyricPulse SHALL hide the template from the Studio template picker and the active Admin list.
3. WHEN an administrator restores a template from the recycle bin, LyricPulse SHALL return the template to the active Admin list with the template status preserved.
4. WHEN an administrator permanently deletes a template from the recycle bin, LyricPulse SHALL remove the template definition from server persistence.
5. IF an administrator permanently deletes a built-in template override, LyricPulse SHALL remove the override record and restore built-in template defaults.

### Requirement 9: Admin Visual Editor

**User Story:** AS an administrator, I want a visual drag editor for template objects, so that title, artist, cover, and lyrics layout can be adjusted without editing JSON.

#### Acceptance Criteria

1. WHEN an administrator selects a template in Admin, LyricPulse SHALL show a visual editor with editable objects for song title, artist name, cover, and lyrics where the base template supports editable layout.
2. WHEN an administrator drags an editable object, LyricPulse SHALL update the selected object's x and y values in the draft layout.
3. WHEN an administrator resizes an editable object, LyricPulse SHALL update the selected object's width and height values in the draft layout.
4. WHEN an administrator changes numeric fields for an editable object, LyricPulse SHALL update x, y, width, height, scale, opacity, visibility, and supported typography values in the draft.
5. WHEN an administrator saves the visual editor draft, LyricPulse SHALL persist ratio-specific layout settings on the server.
6. IF a template has no object-specific editor support, LyricPulse SHALL show metadata and publishing controls while preserving the template render behavior.
