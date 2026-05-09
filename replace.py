import os
import re

dir_path = 'src/components/templates'
for filename in os.listdir(dir_path):
    if not filename.endswith('.tsx'): continue
    filepath = os.path.join(dir_path, filename)
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Titles
    content = re.sub(r'Professional Summary', '個人簡介', content)
    content = re.sub(r'Executive Summary', '個人簡介', content)
    content = re.sub(r'SUMMARY', '個人簡介', content)
    content = re.sub(r'Summary', '個人簡介', content)
    content = re.sub(r'PROFILE', '個人簡介', content)
    content = re.sub(r'Profile', '個人簡介', content)
    
    content = re.sub(r'Work Experience', '工作經歷', content)
    content = re.sub(r'Professional Experience', '工作經歷', content)
    content = re.sub(r'EXPERIENCE', '工作經歷', content)
    content = re.sub(r'Experience', '工作經歷', content)
    
    content = re.sub(r'EDUCATION', '學歷', content)
    content = re.sub(r'Education', '學歷', content)
    content = re.sub(r'Academic Background', '學歷', content)
    
    content = re.sub(r'SKILLS', '技能', content)
    content = re.sub(r'Skills', '技能', content)
    content = re.sub(r'Core Skills', '核心技能', content)
    content = re.sub(r'Technical Skills', '專業技能', content)
    
    content = re.sub(r'LANGUAGES', '語言能力', content)
    content = re.sub(r'Languages', '語言能力', content)
    
    content = re.sub(r'CERTIFICATIONS', '證照', content)
    content = re.sub(r'Certifications', '證照', content)
    
    content = re.sub(r'HOBBIES & INTERESTS', '興趣愛好', content)
    content = re.sub(r'Hobbies & Interests', '興趣愛好', content)
    
    # Dates
    content = re.sub(r'"Present"', '"至今"', content)
    
    # "First Name" and "Last Name"
    content = re.sub(r'"First Name"', '"名"', content)
    content = re.sub(r'"Last Name"', '"姓"', content)
    content = re.sub(r'"Professional Title"', '"專業職稱"', content)
    
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
print('Done!')
