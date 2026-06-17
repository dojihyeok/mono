import os

files = [
    "/Users/yunhyeok/mono/temp_pitch/client/public/pitch.html",
    "/Users/yunhyeok/mono/temp_pitch_only.html"
]

replacements = [
    (
        "중소벤처기업부 「원스톱 자문단」을 선제 가동해, 노무 에스크로 결제 구조에 대한 전자금융거래법 자문 회신을 1R 보고서에 첨부 — ‘법적 리스크를 먼저 지운 도전자’ 구도 완성.",
        "중기부 「원스톱 자문단」 선제 가동을 바탕으로 한 압도적인 기획 완성도로 책임멘토 관찰평가 탑티어 평점을 굳힙니다."
    ),
    (
        "‘인력사무소를 적이 아니라 동료로 만든 도전자’라는 구도를 세팅. 카르텔 흡수를 통한 사회적 합의가 그대로 평가 점수가 됩니다.",
        "인력사무소를 적으로 두지 않고 플랫폼 동료로 포섭한 상생 BM 설계를 집중 부각하여 공개 무대를 압도합니다."
    ),
    (
        "‘인력사무소를 적이 아니라 동료로 만든 도전자’라는 구도를 세팅. 기존 인력사무소들과의 상생 파트너십을 통한 사회적 합의가 그대로 평가 점수가 됩니다.",
        "인력사무소를 적으로 두지 않고 플랫폼 동료로 포섭한 상생 BM 설계를 집중 부각하여 공개 무대를 압도합니다."
    ),
    (
        "동일한 운영 자본으로 더 넓은 시장을 커버한다는 사실이 숫자로 증명되는 라운드. ‘투자할 이유가 분명한 도전자’로 자리매김합니다.",
        "재무 안정성과 스케일업 탄약을 동시에 갖춘 가벼우면서도 견고한 기술 유통망 BM을 통해 전문 심사역의 몰표를 유도합니다."
    ),
    (
        "동일한 운영 자본으로 더 넓은 시장을 커버한다는 사실이 숫자로 증명되는 라운드. ‘투자할 이유가 분명한 도전자’로 자리매김합니다.",
        "재무 안정성과 스케일업 탄약을 동시에 갖춘 가벼우면서도 견고한 기술 유통망 BM을 통해 전문 심사역의 몰표를 유도합니다."
    )
]

for filepath in files:
    if os.path.exists(filepath):
        print(f"Processing: {filepath}")
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
        
        updated = False
        for original, replacement in replacements:
            if original in content:
                content = content.replace(original, replacement)
                updated = True
                print(f"  Replaced: '{original[:20]}...' -> '{replacement[:20]}...'")
        
        if updated:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(content)
            print(f"Updated {filepath}")
    else:
        print(f"Not found: {filepath}")
