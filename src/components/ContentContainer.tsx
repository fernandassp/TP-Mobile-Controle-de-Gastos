import { View, type ViewProps } from 'react-native';
import { MAX_CONTENT_WIDTH } from '../theme';

/** Centraliza e limita a largura do conteúdo em tablets e telas largas. */
export function ContentContainer({ style, ...rest }: ViewProps) {
  return <View style={[{ width: '100%', maxWidth: MAX_CONTENT_WIDTH, alignSelf: 'center' }, style]} {...rest} />;
}
