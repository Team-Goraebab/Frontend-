import { VariantType, SnackbarOrigin } from 'notistack';

type EnqueueSnackbarType = (
  message: string,
  options?: {
    variant: VariantType;
    autoHideDuration?: number;
    anchorOrigin?: SnackbarOrigin;
    style?: React.CSSProperties;
  }
) => void;

/**
 * !! 스낵바 알림을 표시 !!
 *
 * @param enqueueSnackbar - 스낵바 알림을 등록하는 함수
 * @param message - 스낵바에 표시될 메시지
 * @param variant - 스낵바의 종류
 *    - 'default': 특정 스타일링이 없는 표준 알림
 *    - 'error': 오류를 나타내는 알림
 *    - 'success': 성공적인 작업을 나타내는 알림
 *    - 'warning': 경고를 나타내는 알림
 *    - 'info': 정보를 제공하는 알림
 * @param backgroundColor - 스낵바의 배경 색상
 * @param autoHideDuration - 스낵바가 자동으로 숨겨지기 전까지 표시되는 시간(밀리초). 기본값은 1500ms.
 * @param anchorOrigin - 스낵바가 화면에 나타나는 위치. 기본값은 `{ vertical: 'top', horizontal: 'right' }`
 *    - `vertical`: 'top' | 'bottom'
 *    - `horizontal`: 'left' | 'center' | 'right'
 */
export const showSnackbar = (
  enqueueSnackbar: EnqueueSnackbarType,
  message: string,
  variant: VariantType,
  backgroundColor: string,
  autoHideDuration = 1500,
  anchorOrigin: SnackbarOrigin = { vertical: 'top', horizontal: 'right' }
) => {
  enqueueSnackbar(message, {
    variant,
    autoHideDuration,
    anchorOrigin,
    style: { backgroundColor },
  });
};
