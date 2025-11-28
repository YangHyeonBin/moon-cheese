import { Box, Flex, styled } from 'styled-system/jsx';
import { ProgressBar, Spacing, Text } from '@/ui-lib';
import { useMe, type MeResponse } from '@/hooks/queries/user';
import { Loader } from 'lucide-react';
import { isServerError } from '@/utils/error';
import ErrorSection from '@/components/ErrorSection';
import { GRADE_DISPLAY_NAME } from '@/constants/grade';
import { useGradePoint, type GradePoint } from '@/hooks/queries/grade';

/**
 * 유저의 현재 등급을 받아 다음 등급을 찾는 함수
 * @returns 다음 등급 정보 및 다음 등급까지 필요한 포인트, 포인트 프로그레스 수치
 */
const getNextGradeInfo = (
  currentInfo: MeResponse,
  gradePoints: GradePoint[]
): { nextGrade: GradePoint | null; pointsNeeded: number; progress: number } => {
  const { point: currentPoint, grade: myGrade } = currentInfo;

  // minPoint 기준 오름차순 정렬
  const sorted = [...gradePoints].sort((a, b) => a.minPoint - b.minPoint);

  // 현재 포인트보다 minPoint가 큰 첫 번째 등급 = 다음 등급
  const nextGrade = sorted.find(grade => grade.minPoint > currentPoint);

  const currentGrade = sorted.find(grade => grade.type === myGrade);

  if (!currentGrade || !nextGrade) {
    // 최고 등급이거나 데이터에 이상이 있을 경우
    return { nextGrade: null, pointsNeeded: 0, progress: 1 };
  }

  const currentMin = currentGrade.minPoint;
  const nextMin = nextGrade.minPoint;

  return {
    nextGrade,
    pointsNeeded: nextMin - currentPoint,
    progress: (currentPoint - currentMin) / (nextMin - currentMin),
  };
};

function CurrentLevelSection() {
  const myQuery = useMe();
  const gradePointQuery = useGradePoint();

  const queries = [myQuery, gradePointQuery];

  const isLoading = queries.some(q => q.isLoading);
  const hasServerError = queries.some(q => q.error && isServerError(q.error));
  const refetchFailed = () => {
    queries.filter(q => q.error && isServerError(q.error)).forEach(q => q.refetch());
  };

  if (isLoading) {
    return <Loader />;
  }

  if (hasServerError) {
    return <ErrorSection onRetry={refetchFailed} />;
  }

  const my = myQuery.data;
  const gradePoint = gradePointQuery.data;

  if (!my || !gradePoint) {
    console.warn('조회된 데이터가 없습니다.');
    return null;
  }

  console.log(gradePoint);
  return (
    <styled.section css={{ px: 5, py: 4 }}>
      <Text variant="H1_Bold">현재 등급</Text>

      <Spacing size={4} />

      <Box bg="background.01_white" css={{ px: 5, py: 4, rounded: '2xl' }}>
        <Flex flexDir="column" gap={2}>
          <Text variant="H2_Bold">{GRADE_DISPLAY_NAME[my.grade]}</Text>

          <ProgressBar value={getNextGradeInfo(my, gradePoint).progress} size="xs" />

          <Flex justifyContent="space-between">
            <Box textAlign="left">
              <Text variant="C1_Bold">현재 포인트</Text>
              <Text variant="C2_Regular" color="neutral.03_gray">
                {my.point}p
              </Text>
            </Box>
            <Box textAlign="right">
              <Text variant="C1_Bold">다음 등급까지</Text>
              <Text variant="C2_Regular" color="neutral.03_gray">
                {getNextGradeInfo(my, gradePoint).pointsNeeded}p
              </Text>
            </Box>
          </Flex>
        </Flex>
      </Box>
    </styled.section>
  );
}

export default CurrentLevelSection;
