/* ============================================================
   Cloudinary 설정
   
   아래 두 값을 본인의 Cloudinary 계정 정보로 변경하세요.
   - CLOUDINARY_CLOUD_NAME: Dashboard 첫 화면의 Cloud Name
   - CLOUDINARY_UPLOAD_PRESET: Settings > Upload > Upload presets
     에서 Unsigned 모드로 생성한 preset 이름
   
   자세한 방법은 README-ADMIN.md 참고
   ============================================================ */

var CLOUDINARY_CLOUD_NAME = "jfpjnd3j";
var CLOUDINARY_UPLOAD_PRESET = "dgoxoezw";

var CLOUDINARY_ENABLED =
  CLOUDINARY_CLOUD_NAME !== "YOUR_CLOUD_NAME" &&
  CLOUDINARY_UPLOAD_PRESET !== "YOUR_UPLOAD_PRESET" &&
  CLOUDINARY_CLOUD_NAME.length > 0 &&
  CLOUDINARY_UPLOAD_PRESET.length > 0;
