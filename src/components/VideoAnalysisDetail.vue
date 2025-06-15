<template>
  <div class="video-detail-analysis-component q-pa-md bg-grey-1">
    <!-- 닫기 버튼 -->
    <div class="absolute-top-right q-pa-md">
      <q-btn
        icon="close"
        flat
        round
        color="grey-8"
        @click="handleClose"
      />
    </div>

    <!-- 영상 플레이어 + 관절 오버레이 -->
    <div class="video-wrapper q-my-md">
      <video
        ref="videoPlayer"
        controls
        class="w-full rounded-borders shadow-2"
        :src="videoData.videoUrl"
        @timeupdate="onVideoFrame"
      ></video>
      <canvas ref="poseCanvas" class="pose-overlay" />
    </div>

    <!-- 분석 결과 요약 카드 [1, 2] -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">분석 요약</div>
        <q-separator class="q-my-sm" />
        <div class="text-body2">⏱ 동작 길이: 약 {{ videoData.duration }}</div>
        <div class="text-body2">📐 검출 관절 수: {{ videoData.detectedJoints }}개</div>
        <div class="text-body2">🎯 인식 정확도: {{ videoData.accuracy }}</div>
      </q-card-section>
    </q-card>

    <!-- 관절 각도 분석 카드 [3, 4] -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">관절 각도 분석</div>
        <q-separator class="q-my-sm" />
        <q-list dense>
          <q-item v-for="(joint, index) in videoData.jointAngles" :key="index">
            <q-item-section>
              {{ joint.name }}
            </q-item-section>
            <q-item-section side class="text-right">
              {{ joint.angle }}° <span :class="joint.statusClass">({{ joint.status }})</span>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>
    </q-card>

    <!-- 커뮤니티 피드백 영역 [5, 6] -->
    <q-card class="q-mb-md">
      <q-card-section>
        <div class="text-h6">커뮤니티 피드백</div>
        <q-rating v-model="rating" max="5" size="32px" color="amber" />
        <q-separator class="q-my-sm" />
        <q-input v-model="comment" type="textarea" label="피드백을 남겨보세요" />
        <q-btn label="댓글 남기기" @click="submitFeedback" class="q-mt-sm" color="primary" />
        <q-separator class="q-my-md" />
        <div v-for="(fb, idx) in displayedFeedbackList" :key="idx" class="q-mb-sm">
          <q-chip>{{ fb.user }}</q-chip> {{ fb.text }}
        </div>
      </q-card-section>
    </q-card>

    <!-- 공유 / 저장 버튼 [7, 8] -->
    <q-card flat bordered class="q-mb-md q-pa-sm">
      <q-btn flat icon="share" label="공유하기" />
      <q-btn flat icon="bookmark" label="내 보관함에 저장" />
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted } from 'vue';

// ✨ 타입 정의
interface JointAngle {
  name: string;
  angle: number;
  status: string;
  statusClass: string;
}

interface FeedbackItem {
  user: string;
  text: string;
}

interface VideoAnalysisData {
  videoUrl: string;
  title: string; // 영상 제목 [9]
  duration: string; // 예: '1.2초' [1, 2]
  detectedJoints: number; // 검출 관절 수 [1, 2]
  accuracy: string; // 인식 정확도 [1, 2]
  jointAngles: JointAngle[]; // 관절 각도 분석 데이터 [3, 4]
  initialRating: number; // 초기 별점 [5, 6]
  feedbackList: FeedbackItem[]; // 피드백 목록 [7, 8]
  keypointData?: { [frame: number]: { [joint: string]: [number, number] } }; // 관절 좌표 데이터 (옵션) [10, 11]
}

// ✨ 컴포넌트 Props 정의: 부모 컴포넌트로부터 영상 데이터를 받습니다.
const props = defineProps<{
  videoData: VideoAnalysisData;
}>();

// emit을 정의하여 부모 컴포넌트의 showDetail 상태를 변경할 수 있도록 함
const emit = defineEmits(['update:showDetail']);

// 닫기 버튼 클릭 핸들러
const handleClose = () => {
  emit('update:showDetail', false);
};


// ✨ 반응형 상태 변수
const videoPlayer = ref<HTMLVideoElement | null>(null); // 비디오 플레이어 참조
const poseCanvas = ref<HTMLCanvasElement | null>(null); // 캔버스 참조
const rating = ref<number>(props.videoData.initialRating); // 사용자 별점
const comment = ref<string>(''); // 사용자 댓글
const displayedFeedbackList = ref<FeedbackItem[]>([]); // 표시될 피드백 목록

// `videoData.feedbackList`가 변경될 때마다 `displayedFeedbackList`를 업데이트 [7]
watch(() => props.videoData.feedbackList, (newVal) => {
  displayedFeedbackList.value = [...newVal];
}, { immediate: true });

// ✨ 피드백 제출 로직 [12, 13]
function submitFeedback() {
  if (comment.value) {
    // 실제 애플리케이션에서는 이 로직이 API 호출을 통해 서버에 피드백을 저장합니다.
    displayedFeedbackList.value.unshift({ user: '나', text: comment.value }); // 임시로 목록에 추가
    comment.value = '';
  }
}

// ✨ 관절 포인트 그리기 로직 (소스 [14-16] 기반)
const drawKeypoints = (ctx: CanvasRenderingContext2D, points: { [joint: string]: [number, number] }) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 캔버스 지우기
  ctx.strokeStyle = '#00FF88'; // 네온 그린 색상 [17, 18]
  ctx.lineWidth = 2;

  // 관절 연결 라인 (뼈대) 그리기 (예시) [14, 18]
  const skeleton = [
    ['left_shoulder', 'left_elbow'], ['left_elbow', 'left_wrist'],
    ['right_shoulder', 'right_elbow'], ['right_elbow', 'right_wrist'],
    ['left_shoulder', 'right_shoulder'], ['left_shoulder', 'hip'], ['right_shoulder', 'hip'],
    // ... 더 많은 뼈대 연결 가능
  ];
  skeleton.forEach(([a, b]) => {
    if (typeof a !== 'undefined' && typeof b !== 'undefined') {
      if (points[a] && points[b]) {
        ctx.beginPath();
        ctx.moveTo(...points[a]);
        ctx.lineTo(...points[b]);
        ctx.stroke();
      }
      }
  });

  // 관절 포인트(점) 그리기 [15, 19]
  Object.values(points).forEach(([x, y]) => {
    ctx.beginPath();
    ctx.arc(x, y, 4, 0, Math.PI * 2);
    ctx.fillStyle = '#0057FF'; // 스포츠 블루 색상 [17, 19]
    ctx.fill();
  });
};

// ✨ 비디오 프레임 업데이트 시 관절 데이터 렌더링 [16, 20]
const onVideoFrame = () => {
  if (!videoPlayer.value || !poseCanvas.value || !props.videoData.keypointData) return;

  const currentTime = videoPlayer.value.currentTime;
  const fps = 30; // 예시: 초당 30프레임 (실제 AI 분석 FPS에 따라 조정 필요)
  const frame = Math.floor(currentTime * fps);

  const ctx = poseCanvas.value.getContext('2d');
  if (ctx && props.videoData.keypointData[frame]) {
    drawKeypoints(ctx, props.videoData.keypointData[frame]);
  } else if (ctx) {
    ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height); // 해당 프레임에 데이터 없으면 캔버스 지우기
  }
};

// ✨ 컴포넌트 마운트 시 초기화 [16, 20]
onMounted(() => {
  if (videoPlayer.value && poseCanvas.value) {
    const video = videoPlayer.value;
    const canvas = poseCanvas.value;

    // 비디오 크기에 맞춰 캔버스 크기 조정
    canvas.width = video.clientWidth;
    canvas.height = video.clientHeight;

    // 비디오 `timeupdate` 이벤트 리스너 연결
    video.addEventListener('timeupdate', onVideoFrame);

    // 초기 프레임 렌더링
    onVideoFrame();
  }
});

// ✨ 컴포넌트 언마운트 시 이벤트 리스너 해제 [12. 퍼블리이 가이드 - onUnmounted 설명]
onUnmounted(() => {
  if (videoPlayer.value) {
    videoPlayer.value.removeEventListener('timeupdate', onVideoFrame);
  }
});
</script>

<style scoped>

/* 닫기 버튼 호버 효과 */
.q-btn:hover {
  background-color: rgba(0, 0, 0, 0.1);
}

.video-detail-analysis-component {
  width: 100%;
  max-width: 100%; /* 최대 너비 제한 제거 */
  margin: auto;
}

.video-wrapper {
  position: relative;
  width: 100%;
  padding-bottom: 0; /* padding-bottom 제거 */
  height: auto; /* 자동 높이 설정 */
  overflow: visible; /* overflow 제거 */
}

video {
  width: 100%;
  height: auto;
  max-height: 70vh; /* 화면 높이의 70%로 제한 */
  object-fit: contain; /* 비디오 비율 유지 */
}

.pose-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

</style>
