<template>
  <q-page padding class="bg-grey-2">
    <template v-if="!showDetail">
    <!-- 배너 영역 추가 -->
    <div class="q-mb-lg">
      <q-carousel
        v-model="bannerSlide"
        animated
        arrows
        navigation
        infinite
        height="300px"
        class="rounded-borders"
      >
        <q-carousel-slide v-for="(banner, index) in bannerItems"
                          :key="index"
                          :name="index"
                          class="column no-wrap flex-center"
                          @click="showDetail = true"
        >
          <q-img
            :src="banner.image"
            :alt="banner.title"
            style="height: 300px; width: 100%"
          >
            <div class="absolute-full text-center flex flex-center"
                 :class="banner.darkOverlay ? 'bg-black-opacity' : ''">
              <div class="text-white">
                <div class="text-h4 q-mb-md">{{ banner.title }}</div>
                <div class="text-subtitle1">{{ banner.description }}</div>
                <q-btn
                  v-if="banner.action"
                  :label="banner.action"
                  color="primary"
                  class="q-mt-md"
                  push
                />
              </div>
            </div>
          </q-img>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <!-- 1. 검색 바 -->
    <q-input
      v-model="searchTerm"
      placeholder="영상 제목, 설명, 해시태그로 검색"
      clearable
      dense
      outlined
      bg-color="white"
      class="q-mb-md"
    >
      <template v-slot:prepend>
        <q-icon name="search" />
      </template>
    </q-input>

    <!-- 2. 필터 및 정렬 옵션 -->
    <div class="row q-col-gutter-sm q-mb-md">
      <!-- 종목 필터 -->
      <div class="col-6">
        <q-select
          v-model="selectedSport"
          :options="sportOptions"
          label="종목 선택"
          dense
          outlined
          bg-color="white"
          clearable
        />
      </div>
      <!-- 정렬 옵션 -->
      <div class="col-6">
        <q-select
          v-model="sortOption"
          :options="sortOptions"
          label="정렬"
          dense
          outlined
          bg-color="white"
        />
      </div>
    </div>

    <!-- 3. 인기 해시태그 -->
    <div class="q-mb-md">
      <div class="text-subtitle1 q-mb-sm"># 인기 해시태그</div>
      <q-chip
        v-for="tag in popularHashtags"
        :key="tag"
        :label="tag"
        clickable
        outline
        color="primary"
        text-color="primary"
        @click="addHashtagFilter(tag)"
      />
    </div>

    <!-- 4. 영상 목록 -->
    <div class="q-col-gutter-md row items-start">
      <div v-for="video in paginatedVideos" :key="video.id" class="col-6 col-md-4 col-lg-3">
        <q-card class="full-height">
          <q-img :src="video.thumbnail"
                 :alt="video.title"
                 ratio="16/9"
                 spinner-color="primary"
                 spinner-size="82px"
                 class="video-thumbnail"
                 @click="showDetail = true"

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
            <div class="text-caption text-grey-6">{{ video.comments }}개 댓글</div>
          </q-card-section>
        </q-card>
      </div>
    </div>

    <!-- 페이지네이션 추가 -->
    <div class="flex flex-center q-mt-lg">
      <q-pagination
        v-model="currentPage"
        :max="totalPages"
        :max-pages="6"
        boundary-numbers
        direction-links
        color="primary"
      />
    </div>

    <q-page-scroller position="bottom-right" :scroll-offset="150" :offset="[14, 14]">
      <q-btn fab icon="keyboard_arrow_up" color="accent" />
    </q-page-scroller>
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
import { ref, computed, watch } from 'vue';
import VideoAnalysisDetail from 'src/components/VideoAnalysisDetail.vue';

// ✨ 데이터 타입 정의
interface Video {
  id: string;
  title: string;
  hashtag: string;
  thumbnail: string;
  rating: number;
  comments: number;
  sport: string;
}

// 배너 관련 인터페이스 추가
interface BannerItem {
  title: string;
  description: string;
  image: string;
  action?: string;
  darkOverlay?: boolean;
}


// 📄 반응형 상태 변수
const searchTerm = ref<string>(''); // 검색어 [1-9]
const selectedSport = ref<string | null>(null); // 선택된 종목 [3, 5-9]
const sortOption = ref<string>('latest'); // 정렬 옵션 (최신순 기본) [3, 7-9]
const activeHashtag = ref<string | null>(null); // 활성화된 해시태그 필터

// 배너 슬라이드 상태
const bannerSlide = ref(0);


// 페이지네이션 관련 상태 추가
const currentPage = ref(1);
const itemsPerPage = ref(8); // 한 페이지당 보여줄 아이템 수

const showDetail = ref<boolean>(false);

// 📊 옵션 데이터
const sportOptions = ref<string[]>(['야구', '골프', '검도', '탁구', '축구', '농구']); // [4, 6-9, 15, 16]
const sortOptions = ref<{ label: string; value: string }[]>([
  { label: '최신순', value: 'latest' },
  { label: '인기순', value: 'popular' },
  { label: '별점순', value: 'rating' }, // [3, 7-9]
]);
const popularHashtags = ref<string[]>([
  '#내스윙어때',
  '#초보골퍼',
  '#야구폼교정',
  '#검도꿀팁',
  '#탁구서브',
  '#축구드리블',
]); // [12, 13]


// 배너 아이템 데이터
const bannerItems = ref<BannerItem[]>([
  {
    title: '이번 주 인기 스포츠',
    description: '골프, 야구, 축구 인기 영상을 확인하세요',
    image: '/images/golf/43474_52142_3255.jpg',
    action: '더 알아보기',
    darkOverlay: true
  },
  {
    title: '초보자를 위한 가이드',
    description: '스포츠 입문자를 위한 기초 가이드',
    image: '/images/baseball/202105091807770475_6097a6723843f.webp',
    action: '가이드 보기',
    darkOverlay: true
  },
  {
    title: '실시간 인기 트레이너',
    description: '최고의 트레이너와 함께 시작하세요',
    image: '/images/kendo/11194417_728016577315030_3421945850482477207_o.jpg',
    action: '트레이너 찾기',
    darkOverlay: true
  }
]);


// 📚 샘플 영상 데이터 (실제 서비스에서는 API 호출을 통해 가져옴)
const allVideos = ref<Video[]>([
  {
    id: 'v1',
    title: '김민수의 강스윙',
    hashtag: '#야구 #좌타 #슬로우',
    thumbnail: '/images/baseball/202105091807770475_6097a6723843f.webp',
    rating: 4.5,
    comments: 12,
    sport: '야구',
  },
  {
    id: 'v2',
    title: '이하늘 검도 연습',
    hashtag: '#검도 #AI분석 #초단스텝',
    thumbnail: '/images/kendo/11194417_728016577315030_3421945850482477207_o.jpg',
    rating: 5.0,
    comments: 25,
    sport: '검도',
  },
  {
    id: 'v3',
    title: '백스윙 교정 챌린지',
    hashtag: '#골프 #백스윙 #초보',
    thumbnail: '/images/golf/43474_52142_3255.jpg',
    rating: 4.2,
    comments: 8,
    sport: '골프',
  },
  {
    id: 'v4',
    title: '탁구 포핸드 완벽 마스터',
    hashtag: '#탁구 #포핸드 #연습',
    thumbnail: '/images/pingpong/5572_27811_2943.jpg',
    rating: 4.8,
    comments: 15,
    sport: '탁구',
  },
  {
    id: 'v5',
    title: '축구 슈팅 파워 늘리기',
    hashtag: '#축구 #슈팅 #훈련',
    thumbnail: '/images/soccer/177435188_4072085582851307_9091056020645050984_n.jpg',
    rating: 4.1,
    comments: 7,
    sport: '축구',
  },
  {
    id: 'v6',
    title: '농구 드리블 기본기',
    hashtag: '#농구 #드리블 #기본기',
    thumbnail: '/images/basketball/88945_100223_4359.jpg',
    rating: 3.9,
    comments: 5,
    sport: '농구',
  },
  {
    id: 'v7',
    title: '야구 투수 릴리스 분석',
    hashtag: '#야구 #투수 #릴리스',
    thumbnail: '/images/baseball/202105091807770475_6097a6723843f.webp',
    rating: 4.6,
    comments: 18,
    sport: '야구',
  },
  {
    id: 'v8',
    title: '야구 투수 릴리스 분석',
    hashtag: '#야구 #투수 #릴리스',
    thumbnail: '/images/baseball/202105091807770475_6097a6723843f.webp',
    rating: 4.6,
    comments: 18,
    sport: '야구',
  },
  {
    id: 'v9',
    title: '야구 투수 릴리스 분석',
    hashtag: '#야구 #투수 #릴리스',
    thumbnail: '/images/baseball/202105091807770475_6097a6723843f.webp',
    rating: 4.6,
    comments: 18,
    sport: '야구',
  },
  {
    id: 'v10',
    title: '야구 투수 릴리스 분석',
    hashtag: '#야구 #투수 #릴리스',
    thumbnail: '/images/baseball/202105091807770475_6097a6723843f.webp',
    rating: 4.6,
    comments: 18,
    sport: '야구',
  },
  {
    id: 'v11',
    title: '야구 투수 릴리스 분석',
    hashtag: '#야구 #투수 #릴리스',
    thumbnail: '/images/baseball/202105091807770475_6097a6723843f.webp',
    rating: 4.6,
    comments: 18,
    sport: '야구',
  },
  {
    id: 'v12',
    title: '야구 투수 릴리스 분석',
    hashtag: '#야구 #투수 #릴리스',
    thumbnail: '/images/baseball/202105091807770475_6097a6723843f.webp',
    rating: 4.6,
    comments: 18,
    sport: '야구',
  },
]);


// 전체 페이지 수 계산
const totalPages = computed(() => {
  return Math.ceil(filteredVideos.value.length / itemsPerPage.value);
});

// 현재 페이지에 표시할 아이템들
const paginatedVideos = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredVideos.value.slice(start, end);
});



// 🔍 필터링 및 정렬된 영상 목록 (computed 속성)
const filteredVideos = computed(() => {
  let videos = [...allVideos.value];

  // 검색어 필터링
  if (searchTerm.value) {
    const lowerSearchTerm = searchTerm.value.toLowerCase();
    videos = videos.filter(
      (video) =>
        video.title.toLowerCase().includes(lowerSearchTerm) ||
        video.hashtag.toLowerCase().includes(lowerSearchTerm)
    );
  }

  // 종목 필터링
  if (selectedSport.value) {
    videos = videos.filter((video) => video.sport === selectedSport.value);
  }

  // 해시태그 필터링
  if (activeHashtag.value) {
    const lowerActiveHashtag = activeHashtag.value.toLowerCase();
    videos = videos.filter((video) =>
      video.hashtag.toLowerCase().includes(lowerActiveHashtag)
    );
  }

  // 정렬
  switch (sortOption.value) {
    case 'latest':
      // 실제로는 업로드 날짜 기준으로 정렬
      videos.sort((a, b) => b.id.localeCompare(a.id)); // 임시로 ID 역순
      break;
    case 'popular':
      // 실제로는 조회수, 좋아요, 댓글 수 등 복합적으로 판단
      videos.sort((a, b) => b.comments - a.comments); // 임시로 댓글 수 기준
      break;
    case 'rating':
      videos.sort((a, b) => b.rating - a.rating);
      break;
  }

  return videos;
});

// 🏷 해시태그 필터 추가/제거 함수
const addHashtagFilter = (tag: string) => {
  if (activeHashtag.value === tag) {
    activeHashtag.value = null; // 이미 선택된 태그면 해제
  } else {
    activeHashtag.value = tag; // 선택
  }
};

// filteredVideos가 변경될 때 첫 페이지로 돌아가기
watch(filteredVideos, () => {
  currentPage.value = 1;
});

</script>

<style scoped>
/* 추가적인 스타일링이 필요할 경우 여기에 작성 */
/* 카드 높이 통일을 위한 최소 높이 설정 (선택 사항) */
.q-card.full-height {
  min-height: 220px; /* 카드 내용에 따라 조절 */
  display: flex;
  flex-direction: column;
}
.q-card-section {
  flex-grow: 1; /* 섹션이 남은 공간을 채우도록 */
}
.video-thumbnail {
  width: 100%;
  height: 360px;
}

.bg-black-opacity {
  background-color: rgba(0, 0, 0, 0.4);
}

</style>
