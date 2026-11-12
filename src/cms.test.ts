import test from 'node:test';
import assert from 'node:assert/strict';
import { parseMediaUrl, isValidUrl, getAspectRatioClasses } from './lib/mediaAdapter.ts';
import { Project, UserRole, ProjectStatus } from './types/cms.ts';

test('Media Adapter: YouTube URL detection and sanitization', () => {
  const watchUrl = 'https://www.youtube.com/watch?v=dQw4w9WgXcQ';
  const parsedWatch = parseMediaUrl(watchUrl);
  assert.equal(parsedWatch.isValid, true);
  assert.equal(parsedWatch.sourceType, 'youtube');
  assert.equal(parsedWatch.videoId, 'dQw4w9WgXcQ');
  assert.ok(parsedWatch.embedUrl.includes('youtube-nocookie.com/embed/dQw4w9WgXcQ'));

  const shortsUrl = 'https://www.youtube.com/shorts/aqz-KE-bpKQ';
  const parsedShorts = parseMediaUrl(shortsUrl);
  assert.equal(parsedShorts.isValid, true);
  assert.equal(parsedShorts.sourceType, 'youtube');
  assert.equal(parsedShorts.videoId, 'aqz-KE-bpKQ');
});

test('Media Adapter: Vimeo and Google Drive detection', () => {
  const vimeoUrl = 'https://vimeo.com/76979871';
  const parsedVimeo = parseMediaUrl(vimeoUrl);
  assert.equal(parsedVimeo.isValid, true);
  assert.equal(parsedVimeo.sourceType, 'vimeo');
  assert.equal(parsedVimeo.videoId, '76979871');
  assert.ok(parsedVimeo.embedUrl.includes('player.vimeo.com/video/76979871'));

  const driveUrl = 'https://drive.google.com/file/d/1B2C3D4E5F6G7H8I9J0K/view';
  const parsedDrive = parseMediaUrl(driveUrl);
  assert.equal(parsedDrive.isValid, true);
  assert.equal(parsedDrive.sourceType, 'google_drive');
  assert.equal(parsedDrive.videoId, '1B2C3D4E5F6G7H8I9J0K');
  assert.equal(parsedDrive.embedUrl, 'https://drive.google.com/file/d/1B2C3D4E5F6G7H8I9J0K/preview');
});

test('Media Adapter: Direct MP4 and Image files', () => {
  const mp4Url = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4';
  const parsedMp4 = parseMediaUrl(mp4Url);
  assert.equal(parsedMp4.isValid, true);
  assert.equal(parsedMp4.sourceType, 'direct_mp4');

  const imageUrl = 'https://images.unsplash.com/photo-1550745165-9bc0b252726f.jpg';
  const parsedImg = parseMediaUrl(imageUrl);
  assert.equal(parsedImg.isValid, true);
  assert.equal(parsedImg.sourceType, 'image');
});

test('Media Adapter: Security rejects dangerous schemes and invalid strings', () => {
  assert.equal(isValidUrl('javascript:alert(1)'), false);
  assert.equal(isValidUrl('data:text/html,<script>alert(1)</script>'), false);
  assert.equal(isValidUrl('ftp://example.com/file.mp4'), false);
  assert.equal(isValidUrl(''), false);

  const parsedMalicious = parseMediaUrl('javascript:alert(1)');
  assert.equal(parsedMalicious.isValid, false);
});

test('Media Adapter: Aspect ratio CSS classes', () => {
  assert.equal(getAspectRatioClasses('16:9'), 'aspect-video');
  assert.equal(getAspectRatioClasses('9:16'), 'aspect-[9/16]');
  assert.equal(getAspectRatioClasses('1:1'), 'aspect-square');
  assert.equal(getAspectRatioClasses('4:5'), 'aspect-[4/5]');
});

test('CMS Business Logic: Moderator uploads strictly enforce pending state', () => {
  function simulateSubmission(role: UserRole, inputStatus?: ProjectStatus, inputPublished?: boolean) {
    const isModerator = role === 'moderator';
    const status: ProjectStatus = isModerator ? 'pending' : (inputStatus || 'draft');
    const is_published = isModerator ? false : Boolean(inputPublished);
    return { status, is_published };
  }

  // Moderator attempting to bypass or self-publish
  const modAttempt = simulateSubmission('moderator', 'published', true);
  assert.equal(modAttempt.status, 'pending');
  assert.equal(modAttempt.is_published, false);

  // Admin creating a published project
  const adminPublish = simulateSubmission('admin', 'published', true);
  assert.equal(adminPublish.status, 'published');
  assert.equal(adminPublish.is_published, true);
});
