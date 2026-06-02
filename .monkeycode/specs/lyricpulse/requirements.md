# Requirements Document

## Introduction

LyricPulse is a web application for generating dynamic lyric videos from uploaded song audio, LRC lyrics, and cover artwork. The first version targets a local open-source workflow with SaaS-ready architecture, high-quality visual effects, line-level lyric timing, dual output ratios, and MP4 export.

## Glossary

- **LyricPulse**: The dynamic lyric video generation system.
- **Studio**: The browser-based workspace where users upload assets, edit template settings, preview video, and start rendering.
- **Project**: A local generation workspace containing uploaded assets, parsed lyrics, audio analysis, selected template, render settings, and output files.
- **Audio Asset**: A user-uploaded song file in formats such as MP3, WAV, FLAC, or M4A.
- **LRC Asset**: A user-uploaded LRC file containing line-level timestamped lyrics.
- **Cover Asset**: A user-uploaded image file used as the song cover and visual source.
- **Template**: A Remotion composition that renders a specific lyric video visual style.
- **Audio Analysis**: Derived timing and signal data including BPM, beat positions, loudness, and simplified frequency bands.
- **Render Job**: A local backend task that generates an MP4 video from project settings and uploaded assets.
- **Output Ratio**: The selected video aspect ratio, either 9:16 or 16:9.

## Requirements

### Requirement 1: Asset Upload

**User Story:** AS a creator, I want to upload song audio, LRC lyrics, and cover artwork, so that LyricPulse can generate a lyric video from my source assets.

#### Acceptance Criteria

1. WHEN a creator selects an audio file, LyricPulse SHALL accept MP3, WAV, FLAC, and M4A audio assets.
2. WHEN a creator selects a lyrics file, LyricPulse SHALL accept an LRC asset with line-level timestamped lyrics.
3. WHEN a creator selects a cover file, LyricPulse SHALL accept JPG, PNG, and WEBP cover assets.
4. IF an uploaded asset has an unsupported format, LyricPulse SHALL show a format-specific validation message.
5. WHEN all required assets pass validation, LyricPulse SHALL create a project with a project identifier and asset metadata.

### Requirement 2: LRC Parsing

**User Story:** AS a creator, I want LyricPulse to parse line-level LRC lyrics, so that lyric lines appear at the correct time in the generated video.

#### Acceptance Criteria

1. WHEN LyricPulse receives a valid LRC asset, LyricPulse SHALL parse timestamped lyric lines into ordered lyric entries.
2. WHEN multiple lyric lines share the same timestamp, LyricPulse SHALL preserve the source order from the LRC asset.
3. IF the LRC asset contains malformed timestamp lines, LyricPulse SHALL report the malformed line numbers.
4. WHEN parsed lyrics are available, LyricPulse SHALL expose the lyric timeline to the Studio for preview and editing.

### Requirement 3: Audio Analysis

**User Story:** AS a creator, I want video effects to respond to the music, so that the generated lyric video feels synchronized with the song.

#### Acceptance Criteria

1. WHEN LyricPulse processes an audio asset, LyricPulse SHALL generate audio analysis data containing duration, BPM, beat positions, loudness values, and simplified frequency bands.
2. WHEN audio analysis completes, LyricPulse SHALL store analysis data as JSON associated with the project.
3. WHILE previewing a template, LyricPulse SHALL use audio analysis data to drive cover motion, lyric emphasis, background intensity, waveform motion, and beat effects.
4. IF audio analysis partially fails, LyricPulse SHALL provide available analysis fields and mark unavailable fields in the project status.

### Requirement 4: Template Editing And Preview

**User Story:** AS a creator, I want to choose templates and adjust visual parameters, so that I can create a lyric video matching the song style.

#### Acceptance Criteria

1. WHEN a project is ready, LyricPulse SHALL allow the creator to choose one of the built-in templates: PulseCover, NeonLyric, or WaveformStage.
2. WHEN the creator changes output ratio, LyricPulse SHALL update the preview for 9:16 or 16:9 layout.
3. WHEN the creator changes visual settings, LyricPulse SHALL update the preview with the selected theme, colors, font settings, and effect intensity.
4. WHILE previewing, LyricPulse SHALL display the current lyric line based on the preview playback time.

### Requirement 5: Video Rendering

**User Story:** AS a creator, I want to export the configured lyric video as MP4, so that I can share the result on video platforms.

#### Acceptance Criteria

1. WHEN the creator starts export, LyricPulse SHALL create a render job linked to the project configuration.
2. WHILE a render job is running, LyricPulse SHALL show render progress and job status in the Studio.
3. WHEN a render job succeeds, LyricPulse SHALL provide an MP4 output file for preview and download.
4. IF a render job fails, LyricPulse SHALL show the failure reason and keep the project available for another export attempt.

### Requirement 6: Local Open-Source Workflow With SaaS Extension Points

**User Story:** AS an open-source user, I want LyricPulse to run locally with a clean project structure, so that I can use and extend the application without cloud dependencies.

#### Acceptance Criteria

1. WHEN a developer starts LyricPulse locally, LyricPulse SHALL run the web Studio and API service from a pnpm monorepo.
2. WHEN LyricPulse stores project data, LyricPulse SHALL use local storage paths for uploads, analysis data, and rendered outputs.
3. WHEN project records are created, LyricPulse SHALL include identifiers for project, render job, storage provider, and render provider.
4. WHEN a developer configures storage and render providers, LyricPulse SHALL route project file access and render execution through the configured providers.
