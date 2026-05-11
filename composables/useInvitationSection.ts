import { computed } from "vue";
import { useEmotionStyles } from "~/composables/useEmotionStyles";
import { useWeddingStore } from "~/stores/wedding";
import type { Parent, Person } from "~/types/wedding";

interface FamilyNameLine {
  relation: "장남" | "장녀";
  parentsText: string;
  name: string;
}

type PersonWithParents = Person & { parents: Parent[] };

const MESSAGE_SECTION_BREAK_LINE = "이제 평생을 약속하려 합니다.";

// #region 부모님 성함 조합
function assertParentExists(
  parent: Parent | undefined,
  role: Parent["role"]
): asserts parent is Parent {
  if (parent == null) {
    throw new Error(`청첩장 부모님 정보 누락: ${role}`);
  }
}

function getParentByRole(
  parents: Parent[],
  role: Parent["role"]
): Parent {
  const parent = parents.find((entry) => entry.role === role);

  assertParentExists(parent, role);

  return parent;
}

function createFamilyNameLine(
  person: PersonWithParents,
  relation: FamilyNameLine["relation"]
): FamilyNameLine {
  const father = getParentByRole(person.parents, "아버지");
  const mother = getParentByRole(person.parents, "어머니");

  return {
    relation,
    parentsText: `${father.name} · ${mother.name}`,
    name: person.name,
  };
}
// #endregion

export function useInvitationSection() {
  const store = useWeddingStore();
  const { sharedStyles, invitationStyles } = useEmotionStyles();

  // #region 초대 문구
  const invitationMessageLines = computed<string[]>(
    () => store.invitationMessage ?? []
  );

  function isMessageSectionBreak(line: string): boolean {
    return line === MESSAGE_SECTION_BREAK_LINE;
  }
  // #endregion

  // #region 혼주 포함 이름 표기
  const familyNameLines = computed<FamilyNameLine[]>(() => {
    if (store.groom == null || store.bride == null) {
      return [];
    }

    return [
      createFamilyNameLine(store.groom, "장남"),
      createFamilyNameLine(store.bride, "장녀"),
    ];
  });
  // #endregion

  return {
    sharedStyles,
    invitationStyles,
    invitationMessageLines,
    familyNameLines,
    isMessageSectionBreak,
  };
}
