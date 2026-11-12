import test from 'node:test';
import assert from 'node:assert/strict';
import { GALLERY_CATEGORIES, GALLERY_ITEMS } from './components/galleryData';

test('Categories and subcategories strictly match the exact specified order', () => {
  const expectedCategories = ['Motion Graphics', 'Video Editing', 'Graphic Design'];
  assert.deepEqual(
    GALLERY_CATEGORIES.map((c) => c.category),
    expectedCategories,
    'Categories must strictly match the specified 3 in exact order'
  );

  // Motion Graphics subcategories
  const mg = GALLERY_CATEGORIES.find((c) => c.category === 'Motion Graphics');
  assert.ok(mg);
  assert.deepEqual(mg?.subCategories, [
    'Restaurant Ads',
    'Promotional / Commercial Video',
    'Before / After',
    'Logo & Title Animation',
  ]);

  // Video Editing subcategories
  const ve = GALLERY_CATEGORIES.find((c) => c.category === 'Video Editing');
  assert.ok(ve);
  assert.deepEqual(ve?.subCategories, [
    'Podcast Editing',
    'Short-form Content',
    'Before / After',
    'Educational Content',
    'Restaurant Ads',
  ]);

  // Graphic Design subcategories
  const gd = GALLERY_CATEGORIES.find((c) => c.category === 'Graphic Design');
  assert.ok(gd);
  assert.deepEqual(gd?.subCategories, [
    'Social Media Creatives',
    'YouTube Thumbnails',
    'AI Generated Concept Art',
  ]);
});

test('All gallery media items have valid aspect ratios and orientations', () => {
  assert.ok(GALLERY_ITEMS.length >= 10, 'Must have diverse gallery items');

  let hasHorizontal = false;
  let hasVertical = false;

  for (const item of GALLERY_ITEMS) {
    assert.ok(item.id, 'Item must have an id');
    assert.ok(item.title, 'Item must have a title');
    assert.ok(item.category, 'Item must have a category');
    assert.ok(item.subCategory, 'Item must have a subCategory');
    assert.ok(
      item.orientation === 'horizontal' || item.orientation === 'vertical',
      'Orientation must be horizontal or vertical'
    );
    assert.ok(
      item.aspectRatio === '16:9' || item.aspectRatio === '9:16' || item.aspectRatio === '1:1',
      'Aspect ratio must be defined'
    );

    if (item.orientation === 'horizontal') hasHorizontal = true;
    if (item.orientation === 'vertical') hasVertical = true;
  }

  assert.equal(hasHorizontal, true, 'Must include 16:9 horizontal items');
  assert.equal(hasVertical, true, 'Must include 9:16 vertical items');
});

test('Filtering by category and subcategory resolves matching items', () => {
  const mgAds = GALLERY_ITEMS.filter(
    (i) => i.category === 'Motion Graphics' && i.subCategory === 'Restaurant Ads'
  );
  assert.ok(mgAds.length >= 1, 'Should find restaurant ads for motion graphics');

  const vePod = GALLERY_ITEMS.filter(
    (i) => i.category === 'Video Editing' && i.subCategory === 'Podcast Editing'
  );
  assert.ok(vePod.length >= 1, 'Should find podcast editing items');

  const gdAI = GALLERY_ITEMS.filter(
    (i) => i.category === 'Graphic Design' && i.subCategory === 'AI Generated Concept Art'
  );
  assert.ok(gdAI.length >= 1, 'Should find AI concept art items');
});
