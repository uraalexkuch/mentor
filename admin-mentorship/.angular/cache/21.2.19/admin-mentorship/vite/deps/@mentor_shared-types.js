import {
  __commonJS
} from "./chunk-DBLPFQFY.js";

// ../libs/shared-types/dist/index.js
var require_dist = __commonJS({
  "../libs/shared-types/dist/index.js"(exports) {
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.SessionStatus = exports.UserRole = exports.ConsultationTopic = exports.ParticipantNeed = exports.ApplicationStatus = void 0;
    exports.isEligibleAge = isEligibleAge;
    exports.isValidCertificateNumber = isValidCertificateNumber;
    exports.generateCertificateNumber = generateCertificateNumber;
    var ApplicationStatus;
    (function(ApplicationStatus2) {
      ApplicationStatus2["SUBMITTED"] = "подано";
      ApplicationStatus2["IN_PROCESSING"] = "опрацьовується";
      ApplicationStatus2["CONFIRMED"] = "підтверджено";
      ApplicationStatus2["RESERVE"] = "резерв";
      ApplicationStatus2["REJECTED"] = "відмовлено";
      ApplicationStatus2["COMPLETED"] = "завершено навчання";
      ApplicationStatus2["CONSULTATION_DATE"] = "дата консультації";
    })(ApplicationStatus || (exports.ApplicationStatus = ApplicationStatus = {}));
    var ParticipantNeed;
    (function(ParticipantNeed2) {
      ParticipantNeed2["TRAINING"] = "Навчання";
      ParticipantNeed2["MENTORSHIP_SUPPORT"] = "Менторська підтримка";
      ParticipantNeed2["PRACTICAL_HELP"] = "Практична допомога";
      ParticipantNeed2["MICROGRANT_MENTORSHIP"] = "Менторство для мікрогранту";
    })(ParticipantNeed || (exports.ParticipantNeed = ParticipantNeed = {}));
    var ConsultationTopic;
    (function(ConsultationTopic2) {
      ConsultationTopic2["GOVERNMENT_PROGRAMS"] = "Державні програми";
      ConsultationTopic2["GRANT_SELECTION"] = "Підбір грантів";
      ConsultationTopic2["MENTORSHIP_SUPPORT"] = "Менторський супровід";
      ConsultationTopic2["OTHER"] = "Інше";
    })(ConsultationTopic || (exports.ConsultationTopic = ConsultationTopic = {}));
    function isEligibleAge(birthDate) {
      const today = /* @__PURE__ */ new Date();
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || monthDiff === 0 && today.getDate() < birthDate.getDate()) {
        age--;
      }
      return age >= 18 && age <= 25;
    }
    function isValidCertificateNumber(number) {
      const regex = /^\d{8}\/\d{2}-\d{2}$/;
      return regex.test(number);
    }
    function generateCertificateNumber(edrpoU, year) {
      const yearDigits = String(year).slice(-2);
      const randomPart = Math.floor(Math.random() * 9e7 + 1e7).toString();
      const lastTwoDigits = Math.floor(Math.random() * 100).toString().padStart(2, "0");
      return `${randomPart}/${yearDigits}-${lastTwoDigits}`;
    }
    var UserRole;
    (function(UserRole2) {
      UserRole2["ADMIN"] = "admin";
      UserRole2["COORDINATOR"] = "coordinator";
      UserRole2["MENTOR"] = "mentor";
      UserRole2["MENTEE"] = "mentee";
    })(UserRole || (exports.UserRole = UserRole = {}));
    var SessionStatus;
    (function(SessionStatus2) {
      SessionStatus2["PLANNED"] = "планується";
      SessionStatus2["ACTIVE"] = "активна";
      SessionStatus2["COMPLETED"] = "завершена";
      SessionStatus2["CANCELLED"] = "скасована";
    })(SessionStatus || (exports.SessionStatus = SessionStatus = {}));
  }
});
export default require_dist();
//# sourceMappingURL=@mentor_shared-types.js.map
