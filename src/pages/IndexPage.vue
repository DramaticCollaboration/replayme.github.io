<template>
  <q-page padding class="bg-grey-2">
    <template v-if="!showDetail">
      <!-- 1. 추천 영상 영역 (Top Banner / 캐러셀) -->
      <div class="q-mb-md">
        <div class="text-h6 q-mb-sm">✨ 추천 영상</div>
        <q-carousel
          v-model="slide"
          arrows
          animated
          control-color="primary"
          class="rounded-borders"
          height="50vh"
        >
          <q-carousel-slide v-for="(recVideo, index) in recommendedVideos"
                            :key="index"
                            :name="index + 1"
                            :img-src="recVideo.thumbnail"
                            class="main-slide"
                            @click="showDetail = true">
            <div class="absolute-bottom text-white text-subtitle1 q-pa-md bg-black bg-opacity-70">
              {{ recVideo.title }}
            </div>
          </q-carousel-slide>
        </q-carousel>
      </div>

      <!-- 2. 🔥 실시간 인기 영상 (요청하신 썸네일 포함) -->
      <div class="text-h6 q-mb-md">🔥 실시간 인기 영상</div>
      <div class="q-col-gutter-md row items-start">
        <div v-for="video in popularVideos" :key="video.title" class="col-6 col-md-4 col-lg-3">
          <q-card class="full-height" @click="showDetail = true">
            <q-img :src="video.thumbnail"
                   :alt="video.title"
                   ratio="16/9"
                   spinner-color="primary"
                   spinner-size="82px"
                   class="video-thumbnail"

            >
              <template v-slot:error>
                <div class="absolute-full flex flex-center bg-negative text-white">
                  이미지를 불러올 수 없습니다
                </div>
              </template>
            </q-img>
            <q-card-section>
              <div class="text-subtitle2 text-weight-bold">{{ video.title }}</div>
              <div class="text-caption text-grey-7 q-mt-xs">{{ video.hashtag }}</div>
              <q-rating
                size="18px"
                :model-value="video.rating"
                color="yellow"
                readonly
                class="q-mt-xs"
              />
            </q-card-section>
          </q-card>
        </div>
      </div>

      <!-- 3. 오늘의 커뮤니티/토픽 -->
      <div class="q-mt-lg q-mb-md">
        <div class="text-h6 q-mb-sm">💬 오늘의 커뮤니티 토픽</div>
        <q-card flat bordered class="q-pa-md">
          <div class="text-body2 text-grey-8">
            #내스윙어때 #초보골퍼 #야구폼교정 #검도꿀팁 등 다양한 주제로 소통해보세요!
          </div>
        </q-card>
      </div>
    </template>
    <VideoAnalysisDetail v-if="showDetail" v-model:showDetail="showDetail"
                         :video-data="{
      videoUrl: '/videos/5182772-uhd_3840_2160_25fps.mp4',
      title: '운동 동작 분석',
      duration: '1.5초',
      detectedJoints: 17,
      accuracy: '95%',
      jointAngles: [
        { name: '왼쪽 팔꿈치', angle: 90, status: '정상', statusClass: 'text-positive' },
        { name: '오른쪽 팔꿈치', angle: 85, status: '주의', statusClass: 'text-warning' },
        { name: '왼쪽 무릎', angle: 100, status: '정상', statusClass: 'text-positive' },
        { name: '오른쪽 무릎', angle: 95, status: '정상', statusClass: 'text-positive' }
      ],
      initialRating: 4,
      feedbackList: [
        { user: '트레이너Kim', text: '전반적으로 좋은 자세입니다!' },
        { user: 'fitness_pro', text: '팔꿈치 각도를 조금 더 주의해주세요.' }
      ],
      keypointData: {
        0: {
          'left_shoulder': [100, 100],
          'left_elbow': [150, 150],
          'left_wrist': [200, 200]
          // ... 더 많은 관절 포인트
        }
        // ... 더 많은 프레임
      }
    }"></VideoAnalysisDetail>
  </q-page>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import VideoAnalysisDetail from 'src/components/VideoAnalysisDetail.vue';

// 추천 영상 데이터의 타입 정의
interface RecommendedVideo {
  title: string;
  thumbnail: string;
}

// 인기 영상 데이터의 타입 정의
interface PopularVideo {
  title: string;
  hashtag: string;
  thumbnail: string;
  rating: number;
}

// 추천 영상 캐러셀 슬라이드 번호 (number 타입 명시)
const slide = ref<number>(1);
const showDetail = ref<boolean>(false);


// 추천 영상 데이터 (RecommendedVideo[] 타입 명시)
const recommendedVideos = ref<RecommendedVideo[]>([
  {
    title: '프로선수의 완벽한 투구폼 분석',
    thumbnail: '/images/baseball/202105091807770475_6097a6723843f.webp',
  },
  {
    title: '아이언샷 비거리 20m 늘리기',
    thumbnail: '/images/golf/43474_52142_3255.jpg',
  },
  {
    title: '검도 초단 스텝의 비밀',
    thumbnail: '/images/kendo/11194417_728016577315030_3421945850482477207_o.jpg',
  },
]);

// 실시간 인기 영상 데이터 (PopularVideo[] 타입 명시)
const popularVideos = ref<PopularVideo[]>([
  {
    title: '김민수의 강스윙',
    hashtag: '#야구 #좌타 #슬로우',
    thumbnail: '/images/baseball/202105091807770475_6097a6723843f.webp',
    rating: 4.5,
  },
  {
    title: '이하늘 검도 연습',
    hashtag: '#검도 #AI분석',
    thumbnail: '/images/kendo/11194417_728016577315030_3421945850482477207_o.jpg',
    rating: 5,
  },
  {
    title: '백스윙 교정 챌린지',
    hashtag: '#골프 #백스윙 #초보',
    thumbnail: '/images/golf/43474_52142_3255.jpg',
    rating: 4.2,
  },
  {
    title: '탁구 포핸드 완벽 마스터',
    hashtag: '#탁구 #포핸드 #연습',
    thumbnail: '/images/pingpong/5572_27811_2943.jpg',
    rating: 4.8,
  },
  // 더 많은 인기 영상 추가 가능
]);
</script>

<style scoped>
.main-slide {
  padding: 0;
  background-size: contain !important;
  background-position: center center;
  background-repeat: no-repeat;
}

.video-thumbnail {
  width: 100%;
  height: 360px;
}
</style>
