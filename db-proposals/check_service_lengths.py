import json

data = json.load(open('mommantum_schema_antigravity_prompt.json', 'r', encoding='utf-8'))
services = data.get('services_keywords_and_faqs', {}).get('services', [])

print(f"Total services in json: {len(services)}")
for s in services:
    slug = s.get('slug')
    # Let's check name and text in prompt or in data
    print(f"Service: {slug}")
