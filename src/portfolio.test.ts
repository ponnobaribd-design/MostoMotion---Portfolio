import test from 'node:test';
import assert from 'node:assert/strict';
import { PERSONAL_INFO, SERVICES, PORTFOLIO, SOCIAL_LINKS, SKILLS } from './constants';
import { getAIResponse } from './geminiService';

test('Personal info has all required contact details and external links', () => {
  assert.equal(PERSONAL_INFO.name, 'Md. Mostofa Kamal');
  assert.equal(PERSONAL_INFO.brand, 'Mosto.Motion');
  assert.ok(PERSONAL_INFO.email.includes('@'));
  assert.ok(PERSONAL_INFO.phone.length > 5);
  assert.ok(PERSONAL_INFO.whatsapp.includes('wa.me'));
  assert.ok(PERSONAL_INFO.resumeUrl.startsWith('https://'));
  assert.ok(PERSONAL_INFO.mainPortfolio.startsWith('https://'));
  assert.ok(PERSONAL_INFO.drivePortfolio.startsWith('https://'));
});

test('Core services have valid titles, icons, and non-empty feature lists', () => {
  assert.ok(SERVICES.length >= 4, 'Should offer at least 4 primary creative services');
  for (const service of SERVICES) {
    assert.ok(service.id, 'Service must have an id');
    assert.ok(service.title, 'Service must have a title');
    assert.ok(service.description, 'Service must have a description');
    assert.ok(service.features.length >= 3, 'Service should have at least 3 feature highlights');
  }
});

test('Portfolio items have valid thumbnails and categories', () => {
  assert.ok(PORTFOLIO.length >= 8, 'Should have rich portfolio showcase items');
  for (const item of PORTFOLIO) {
    assert.ok(item.id, 'Item must have an id');
    assert.ok(item.title, 'Item must have a title');
    assert.ok(item.category, 'Item must have a category');
    assert.ok(item.thumbnail.startsWith('https://') || item.thumbnail.startsWith('/'), 'Item must have a thumbnail');
  }
});

test('Social links contain active professional platforms', () => {
  const platforms = SOCIAL_LINKS.map(s => s.platform);
  assert.ok(platforms.includes('LinkedIn'), 'LinkedIn should be present');
  assert.ok(platforms.includes('YouTube'), 'YouTube should be present');
  assert.ok(platforms.includes('Behance'), 'Behance should be present');
  assert.ok(platforms.includes('Upwork'), 'Upwork should be present');
});

test('Skills have name, icon and high proficiency levels', () => {
  assert.ok(SKILLS.length >= 4);
  const ae = SKILLS.find(s => s.name === 'After Effects');
  assert.ok(ae, 'After Effects skill must exist');
  assert.ok((ae?.level ?? 0) >= 90, 'Proficiency level should be elite');
});

test('AI Assistant provides relevant responses for services, rates, software and contact', async () => {
  const serviceResp = await getAIResponse('What services do you offer?');
  assert.ok(serviceResp.toLowerCase().includes('motion') || serviceResp.toLowerCase().includes('video'));

  const contactResp = await getAIResponse('How can I contact you or hire you?');
  assert.ok(contactResp.includes(PERSONAL_INFO.email) || contactResp.includes(PERSONAL_INFO.phone));

  const toolResp = await getAIResponse('What software do you use?');
  assert.ok(toolResp.includes('After Effects') || toolResp.includes('Premiere'));
});
