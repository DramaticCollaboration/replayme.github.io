<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">👤 프로필</div>

    <!-- 1. 사용자 기본 정보 카드 -->
    <q-card class="q-mb-lg">
      <q-card-section class="text-center">
        <q-avatar size="100px" class="q-mb-md">
          <img :src="userProfile.avatar" alt="User Avatar">
        </q-avatar>
        <div class="text-h6 text-weight-bold">{{ userProfile.nickname }}</div>
        <div class="text-subtitle2 text-grey-7">{{ userProfile.email }}</div>
        <div class="q-mt-sm">
          <q-icon name="star" color="amber" size="20px" />
          <span class="text-body1 text-weight-medium q-ml-xs">{{ userProfile.averageRating.toFixed(1) }}점</span>
        </div>
        <div class="text-body2 text-grey-7 q-mt-xs">
          팔로워: {{ userProfile.followers }}명 | 업로드 영상: {{ userProfile.uploadedVideosCount }}개
        </div>
        <div class="text-body2 text-grey-7 q-mt-xs">
          관심 종목: {{ userProfile.interestedSports.join(', ') || '설정 필요' }}
        </div>
      </q-card-section>
      <q-separator />
      <q-card-actions align="center">
        <q-btn flat label="프로필 수정" color="primary" @click="editProfile" />
        <q-btn flat label="관심 종목 변경" color="primary" @click="editSports" />
      </q-card-actions>
    </q-card>

    <!-- 2. 내가 올린 영상 목록 -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">내 영상 목록 ({{ userProfile.uploadedVideosCount }}개)</div>
        <q-list bordered separator class="rounded-borders">
          <q-item v-for="video in uploadedVideos" :key="video.id" clickable v-ripple @click="goToVideoDetail(video.id)">
            <q-item-section thumbnail>
              <img :src="video.thumbnail" :alt="video.title" style="width: 80px; height: 45px; object-fit: cover;" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-body2 text-weight-medium">{{ video.title }}</q-item-label>
              <q-item-label caption>
                <q-icon name="star" color="amber" size="14px" /> {{ video.rating.toFixed(1) }}점 &bull;
                <q-icon name="chat_bubble" size="14px" /> {{ video.comments }}
              </q-item-label>
            </q-item-section>
            <q-item-section side>
              <q-icon name="chevron_right" />
            </q-item-section>
          </q-item>
          <q-item v-if="uploadedVideos.length === 0">
            <q-item-section class="text-center text-grey-6 q-py-lg">
              아직 업로드한 영상이 없습니다.
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- 3. 내가 받은 피드백 (간략화) -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">받은 피드백</div>
        <q-list bordered separator class="rounded-borders">
          <q-item v-for="feedback in receivedFeedback" :key="feedback.id">
            <q-item-section avatar>
              <q-avatar size="sm" :icon="getFeedbackIcon(feedback.type)" :color="getFeedbackColor(feedback.type)" text-color="white" />
            </q-item-section>
            <q-item-section>
              <q-item-label class="text-body2">{{ feedback.message }}</q-item-label>
              <q-item-label caption>{{ formatDateTime(feedback.timestamp) }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item v-if="receivedFeedback.length === 0">
            <q-item-section class="text-center text-grey-6 q-py-lg">
              받은 피드백이 없습니다.
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- 4. 설정 -->
    <q-card class="q-mb-lg">
      <q-card-section>
        <div class="text-h6 q-mb-md">설정</div>
        <q-list dense>
          <q-item clickable v-ripple @click="changePassword">
            <q-item-section>비밀번호 변경</q-item-section>
            <q-item-section side><q-icon name="chevron_right" /></q-item-section>
          </q-item>
          <q-item>
            <q-item-section>푸시 알림 설정</q-item-section>
            <q-item-section side>
              <q-toggle v-model="settings.pushNotifications" color="primary" />
            </q-item-section>
          </q-item>
          <q-item clickable v-ripple @click="logout">
            <q-item-section class="text-negative">로그아웃</q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- 프로필 수정 다이얼로그 (플레이스홀더) -->
    <q-dialog v-model="showEditProfileDialog">
      <q-card style="min-width: 350px;">
        <q-card-section>
          <div class="text-h6">프로필 수정</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-input v-model="tempProfile.nickname" label="닉네임" class="q-mb-md" />
          <q-file v-model="tempProfile.newAvatar" label="아바타 변경 (이미지 파일)" accept="image/*" clearable>
            <template v-slot:prepend>
              <q-icon name="attach_file" />
            </template>
          </q-file>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="취소" color="primary" @click="showEditProfileDialog = false" />
          <q-btn flat label="저장" color="primary" @click="saveProfile" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- 관심 종목 변경 다이얼로그 (플레이스홀더) -->
    <q-dialog v-model="showEditSportsDialog">
      <q-card style="min-width: 350px;">
        <q-card-section>
          <div class="text-h6">관심 종목 변경</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-select
            filled
            v-model="tempProfile.interestedSports"
            :options="availableSports"
            label="관심 종목 선택 (다중 선택 가능)"
            multiple
            use-chips
            stack-label
          />
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="취소" color="primary" @click="showEditSportsDialog = false" />
          <q-btn flat label="저장" color="primary" @click="saveSports" />
        </q-card-actions>
      </q-card>
    </q-dialog>

  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { date, useQuasar } from 'quasar';
// import { useRouter } from 'vue-router'; // 실제 라우팅 시 필요

// 📄 타입 정의
interface UserProfile {
  id: string;
  nickname: string;
  email: string;
  avatar: string;
  averageRating: number;
  followers: number;
  uploadedVideosCount: number;
  interestedSports: string[];
}

interface UserVideo {
  id: string;
  title: string;
  thumbnail: string;
  rating: number;
  comments: number;
  uploadedAt: Date;
}

interface ReceivedFeedback {
  id: string;
  type: 'star' | 'comment' | 'follow'; // 알림 타입과 유사
  message: string;
  timestamp: Date;
  relatedId?: string; // 관련 영상/사용자 ID (클릭 시 이동 가능)
}

interface UserSettings {
  pushNotifications: boolean;
  darkMode: boolean; // 예시
}

// 📄 반응형 상태 변수
const $q = useQuasar();
// const router = useRouter(); // 실제 라우팅 시 필요

const userProfile = ref<UserProfile>({
  id: 'user123',
  nickname: 'ReplayMe유저',
  email: 'user@replayme.com',
  avatar: '/images/avatar.png', // 기본 아바타 (예시)
  averageRating: 4.3,
  followers: 125,
  uploadedVideosCount: 0, // 실제 영상 수에 따라 업데이트될 것임
  interestedSports: ['야구', '골프'], // 사용자가 선택한 관심 종목
});

const uploadedVideos = ref<UserVideo[]>([
  { id: 'v1', title: '나의 강스윙 분석', thumbnail: '/images/basketball/88945_100223_4359.jpg', rating: 4.5, comments: 8, uploadedAt: new Date('2025-06-10T14:30:00Z') },
  { id: 'v2', title: '투구폼 교정 연습', thumbnail: '/images/basketball/88945_100223_4359.jpg', rating: 4.1, comments: 3, uploadedAt: new Date('2025-06-05T10:00:00Z') },
  { id: 'v3', title: '검도 베기 연습', thumbnail: '/images/kendo/11194417_728016577315030_3421945850482477207_o.jpg', rating: 4.8, comments: 15, uploadedAt: new Date('2025-05-28T18:00:00Z') },
]);

// `uploadedVideosCount`는 `uploadedVideos` 배열의 길이에 연동되도록 computed로 정의
userProfile.value.uploadedVideosCount = computed(() => uploadedVideos.value.length).value;

const receivedFeedback = ref<ReceivedFeedback[]>([
  { id: 'fb1', type: 'star', message: '김민수님이 회원님의 "강스윙 분석" 영상에 별점 5점을 주었습니다.', timestamp: new Date('2025-06-20T10:00:00Z'), relatedId: 'v1' },
  { id: 'fb2', type: 'comment', message: '박지영님이 "투구폼 교정" 영상에 댓글을 남겼습니다: "정말 좋아졌네요!"', timestamp: new Date('2025-06-19T15:30:00Z'), relatedId: 'v2' },
  { id: 'fb3', type: 'follow', message: '새로운 팔로워: 이하늘님이 회원님을 팔로우하기 시작했습니다.', timestamp: new Date('2025-06-17T09:10:00Z') },
]);

const settings = ref<UserSettings>({
  pushNotifications: true,
  darkMode: false, // 예시 설정
});

// 프로필 수정 다이얼로그 관련 상태
const showEditProfileDialog = ref(false);
const tempProfile = ref<Partial<UserProfile & { newAvatar: File | null }>>({}); // 부분적으로 업데이트할 프로필 정보 및 새 아바타 파일

// 관심 종목 변경 다이얼로그 관련 상태
const showEditSportsDialog = ref(false);
const availableSports = ['야구', '골프', '검도', '탁구', '축구', '농구']; // 선택 가능한 모든 종목

/**
 * @function formatDateTime
 * Date 객체를 "YYYY.MM.DD HH:mm" 형식의 문자열로 포맷팅합니다.
 * @param datetime Date - 포맷팅할 날짜/시간
 * @returns string 포맷된 날짜/시간 문자열
 */
const formatDateTime = (datetime: Date): string => {
  return date.formatDate(datetime, 'YYYY.MM.DD HH:mm');
};

/**
 * @function getFeedbackIcon
 * 피드백 타입에 따라 적절한 Quasar 아이콘 이름을 반환합니다.
 * @param type 피드백 타입
 * @returns string 아이콘 이름
 */
const getFeedbackIcon = (type: ReceivedFeedback['type']): string => {
  switch (type) {
    case 'star':
      return 'star';
    case 'comment':
      return 'chat_bubble';
    case 'follow':
      return 'person_add';
    default:
      return 'notifications'; // 기본 아이콘
  }
};

/**
 * @function getFeedbackColor
 * 피드백 타입에 따라 적절한 Quasar 색상 클래스를 반환합니다.
 * @param type 피드백 타입
 * @returns string 색상 클래스
 */
const getFeedbackColor = (type: ReceivedFeedback['type']): string => {
  switch (type) {
    case 'star':
      return 'amber';
    case 'comment':
      return 'blue';
    case 'follow':
      return 'green';
    default:
      return 'grey'; // 기본 색상
  }
};

// 📄 액션 함수 (플레이스홀더)
/**
 * @function editProfile
 * 프로필 수정 다이얼로그를 엽니다.
 */
const editProfile = (): void => {
  // 현재 프로필 정보로 임시 프로필 초기화 (객체 복사)
  tempProfile.value = { ...userProfile.value, newAvatar: null };
  showEditProfileDialog.value = true;
};

/**
 * @function saveProfile
 * 프로필 수정 내용을 저장합니다. (실제로는 API 호출 필요)
 */
const saveProfile = (): void => {
  if (tempProfile.value.nickname) {
    userProfile.value.nickname = tempProfile.value.nickname;
  }
  if (tempProfile.value.newAvatar) {
    // 실제 서버에 아바타 업로드 및 URL 업데이트 로직 필요
    userProfile.value.avatar = URL.createObjectURL(tempProfile.value.newAvatar); // 임시 미리보기
  }
  $q.notify({
    message: '프로필 정보가 수정되었습니다.',
    color: 'positive',
    icon: 'check_circle',
  });
  showEditProfileDialog.value = false;
};

/**
 * @function editSports
 * 관심 종목 변경 다이얼로그를 엽니다.
 */
const editSports = (): void => {
  // 현재 관심 종목을 임시 프로필의 관심 종목으로 복사
  tempProfile.value = { interestedSports: [...userProfile.value.interestedSports] };
  showEditSportsDialog.value = true;
};

/**
 * @function saveSports
 * 관심 종목 변경 내용을 저장합니다. (실제로는 API 호출 필요)
 */
const saveSports = (): void => {
  if (tempProfile.value.interestedSports) {
    userProfile.value.interestedSports = tempProfile.value.interestedSports;
  }
  $q.notify({
    message: '관심 종목이 수정되었습니다.',
    color: 'positive',
    icon: 'check_circle',
  });
  showEditSportsDialog.value = false;
};


/**
 * @function goToVideoDetail
 * 영상 목록 클릭 시 해당 영상 상세 페이지로 이동합니다.
 * @param videoId string - 클릭된 영상의 ID
 */
const goToVideoDetail = (videoId: string): void => {
  // 실제 서비스에서는 Vue Router를 사용하여 영상 상세 페이지로 이동
  // router.push(`/video/${videoId}`);
  alert(`영상 상세 페이지로 이동: ${videoId}`); // 예시 알림
  console.log(`Navigate to video detail: ${videoId}`);
};

/**
 * @function changePassword
 * 비밀번호 변경 페이지로 이동합니다.
 */
const changePassword = (): void => {
  alert('비밀번호 변경 페이지로 이동합니다.'); // 예시 알림
  // 실제 서비스에서는 라우터 푸시: router.push('/settings/change-password');
  console.log('Change password clicked.');
};

/**
 * @function logout
 * 로그아웃 처리 및 사용자에게 확인 메시지를 표시합니다.
 */
const logout = (): void => {
  $q.dialog({
    title: '로그아웃',
    message: '정말로 로그아웃하시겠습니까?',
    cancel: true,
    persistent: true,
  }).onOk(() => {
    alert('로그아웃 되었습니다.'); // 예시 알림
    // 실제 서비스에서는 인증 토큰 삭제 및 로그인 페이지로 리디렉션
    // router.push('/login');
    console.log('User logged out.');
  });
};
</script>

<style scoped>
.q-avatar img {
  object-fit: cover; /* 아바타 이미지가 잘리지 않고 채워지도록 */
}
</style>
