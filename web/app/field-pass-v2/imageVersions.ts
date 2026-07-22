// 이미지 캐시 버스팅용 버전 태그 — 파일 내용의 md5 앞 8자리.
// 이미지를 교체할 때마다 아래 값을 재생성해서 갱신한다:
//   cd web/public/images/field-pass && for f in *.png; do echo "$f $(md5 -q "$f" | cut -c1-8)"; done
// 값이 바뀌면 이미지 URL(?v=...)이 함께 바뀌어 브라우저·CDN 캐시를 무조건 새로 받는다.
export const IMAGE_VERSION: Record<string, string> = {
  '01_Hero_Bridge_1920x1080.png': 'c5a5c02b',
  '02_AllPass_Connect_1920x1080.png': '868f6bf5',
  '03_Auth_Pain_Solution_1920x1080.png': '817b0e74',
  '04_Service_Flow_1920x1080.png': '96acc58f',
  '05_Hybrid_Authentication_1920x1080.png': '52d8282e',
  '06_MONO_x_SSenStone_1920x1080.png': 'eb5b29e9',
  '07_Permission_Expansion_1920x1080.png': 'd427f489',
  '08_Data_Integration_1920x1080.png': '9de5f976',
  '09_Public_Launch_1920x1080.png': 'eab99bca',
};

export function versionedImage(path: string): string {
  const filename = path.split('/').pop() ?? '';
  const v = IMAGE_VERSION[filename];
  return v ? `${path}?v=${v}` : path;
}
