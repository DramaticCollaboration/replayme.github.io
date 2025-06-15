<template>
  <q-page padding>
    <div class="text-h5 q-mb-md">🔔 알림</div>

    <q-list bordered separator class="rounded-borders">
      <q-item
        v-for="notification in notifications"
        :key="notification.id"
        :class="{ 'bg-grey-1': !notification.read, 'notification-item': true }"
        clickable
        v-ripple
        @click="onNotificationClick(notification)"
      >
        <q-item-section avatar>
          <q-avatar
            :icon="getNotificationIcon(notification.type)"
            :color="getNotificationColor(notification.type)"
            text-color="white"
            size="md"
          />
        </q-item-section>

        <q-item-section>
          <q-item-label class="text-body2 text-weight-medium">{{ notification.message }}</q-item-label>
          <q-item-label caption class="text-grey-7">
            {{ formatDateTime(notification.timestamp) }}
          </q-item-label>
        </q-item-section>

        <q-item-section side v-if="!notification.read">
          <q-badge color="red" rounded floating />
        </q-item-section>
      </q-item>

      <q-item v-if="notifications.length === 0">
        <q-item-section class="text-center text-grey-6 q-py-lg">
          새로운 알림이 없습니다.
        </q-item-section>
      </q-item>
    </q-list>

    <q-footer class="bg-transparent text-center q-pa-md">
      <q-btn flat label="모든 알림 읽음으로 표시" color="grey-6" @click="markAllAsRead" v-if="hasUnreadNotifications" />
    </q-footer>
  </q-page>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { date } from 'quasar'; // Quasar의 날짜 유틸리티 임포트

// 📄 알림 데이터의 타입 정의
interface Notification {
  id: string;
  type: 'star' | 'comment' | 'like' | 'follow' | 'admin' | 'event';
  message: string;
  timestamp: Date; // 날짜 객체로 변경
  read: boolean;
  relatedContentId?: string; // 관련 영상 ID (클릭 시 이동 가능)
  relatedUserId?: string; // 관련 사용자 ID (클릭 시 프로필 이동 가능)
}

// 📄 반응형 상태 변수
const notifications = ref<Notification[]>([
  {
    id: 'notif1',
    type: 'star',
    message: '김민수님이 회원님의 "강스윙" 영상에 별점 5점을 주었습니다!',
    timestamp: new Date('2025-06-20T10:00:00Z'),
    read: false,
    relatedContentId: 'video123',
  },
  {
    id: 'notif2',
    type: 'comment',
    message: '박지영님이 회원님의 "검도 자세" 영상에 댓글을 남겼습니다: "자세가 정말 좋네요!"',
    timestamp: new Date('2025-06-19T15:30:00Z'),
    read: false,
    relatedContentId: 'video456',
  },
  {
    id: 'notif3',
    type: 'like',
    message: '이하늘님이 회원님의 "야구 투구" 영상에 좋아요를 눌렀습니다.',
    timestamp: new Date('2025-06-18T20:45:00Z'),
    read: true,
    relatedContentId: 'video789',
  },
  {
    id: 'notif4',
    type: 'follow',
    message: '새로운 팔로워: 최준석님이 회원님을 팔로우하기 시작했습니다.',
    timestamp: new Date('2025-06-17T09:10:00Z'),
    read: true,
    relatedUserId: 'userABC',
  },
  {
    id: 'notif5',
    type: 'admin',
    message: '[공지] ReplayMe 서비스 점검 안내 (6월 25일 01시~03시)',
    timestamp: new Date('2025-06-16T11:00:00Z'),
    read: true,
  },
  {
    id: 'notif6',
    type: 'event',
    message: '[이벤트] "최고의 스윙 챌린지"가 시작되었습니다! 지금 참여하세요!',
    timestamp: new Date('2025-06-15T14:00:00Z'),
    read: true,
  },
]);

// 📄 읽지 않은 알림이 있는지 확인하는 computed 속성
const hasUnreadNotifications = computed(() => {
  return notifications.value.some(notif => !notif.read);
});

/**
 * @function getNotificationIcon
 * 알림 타입에 따라 적절한 Quasar 아이콘 이름을 반환합니다.
 * @param type 알림 타입
 * @returns string 아이콘 이름
 */
const getNotificationIcon = (type: Notification['type']): string => {
  switch (type) {
    case 'star':
      return 'star';
    case 'comment':
      return 'chat_bubble';
    case 'like':
      return 'favorite';
    case 'follow':
      return 'person_add';
    case 'admin':
      return 'campaign'; // 또는 'info', 'notifications_active'
    case 'event':
      return 'emoji_events'; // 또는 'card_giftcard'
    default:
      return 'notifications';
  }
};

/**
 * @function getNotificationColor
 * 알림 타입에 따라 적절한 Quasar 색상 클래스를 반환합니다.
 * @param type 알림 타입
 * @returns string 색상 클래스
 */
const getNotificationColor = (type: Notification['type']): string => {
  switch (type) {
    case 'star':
      return 'amber';
    case 'comment':
      return 'blue';
    case 'like':
      return 'red';
    case 'follow':
      return 'green';
    case 'admin':
      return 'purple';
    case 'event':
      return 'orange';
    default:
      return 'grey';
  }
};

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
 * @function onNotificationClick
 * 알림 항목 클릭 시 호출되는 함수.
 * 실제 서비스에서는 해당 알림의 상세 페이지(영상, 프로필 등)로 이동하거나 추가 작업을 수행합니다.
 * @param notification Notification - 클릭된 알림 객체
 */
const onNotificationClick = (notification: Notification): void => {
  // 알림을 읽음 상태로 변경
  notification.read = true;
  console.log('알림 클릭:', notification);

  // 예시: 관련 영상 또는 프로필로 이동
  if (notification.relatedContentId) {
    // router.push(`/video/${notification.relatedContentId}`); // Vue Router 사용 시
    alert(`영상 상세 페이지로 이동: ${notification.relatedContentId}`);
  } else if (notification.relatedUserId) {
    // router.push(`/profile/${notification.relatedUserId}`); // Vue Router 사용 시
    alert(`사용자 프로필로 이동: ${notification.relatedUserId}`);
  }
  // 그 외 알림 (공지, 이벤트 등)은 팝업으로 내용을 자세히 보여줄 수 있습니다.
};

/**
 * @function markAllAsRead
 * 모든 알림을 읽음 상태로 변경합니다.
 */
const markAllAsRead = (): void => {
  notifications.value.forEach(notif => {
    notif.read = true;
  });
  alert('모든 알림을 읽음으로 표시했습니다.');
};
</script>

<style scoped>
.notification-item {
  transition: background-color 0.3s ease;
}
.bg-grey-1 {
  background-color: #f5f5f5; /* 읽지 않은 알림 배경색 */
}
/* 읽은 알림의 배경색은 Quasar 기본값 또는 다른 색상으로 설정 가능 */
</style>
