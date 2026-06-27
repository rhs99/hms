import { Box, Flex, Heading, Text } from '@optiaxiom/react';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

export { AlertBanner, useAlertState } from '../../component/alerts';

export const Card = ({ children, ...rest }) => (
  <Box
    bg="bg.default"
    rounded="xl"
    border="1"
    borderColor="border.secondary"
    shadow="sm"
    style={{ overflow: 'hidden' }}
    {...rest}
  >
    {children}
  </Box>
);

export const CardHeader = ({ icon, title, subtitle, trailing, level = 4 }) => (
  <Flex
    flexDirection="row"
    alignItems="center"
    justifyContent="space-between"
    bg="bg.secondary"
    p="16"
    borderColor="border.tertiary"
    style={{ borderBottomWidth: '1px', borderBottomStyle: 'solid' }}
  >
    <Flex flexDirection="row" alignItems="center" gap="12">
      {icon && (
        <Flex alignItems="center" justifyContent="center" color="fg.accent.strong" style={{ fontSize: '20px' }}>
          {icon}
        </Flex>
      )}
      <Flex flexDirection="column" gap="2">
        <Heading level={String(level)} color="fg.default">
          {title}
        </Heading>
        {subtitle && (
          <Text fontSize="sm" color="fg.tertiary">
            {subtitle}
          </Text>
        )}
      </Flex>
    </Flex>
    {trailing}
  </Flex>
);

export const CardBody = ({ children, ...rest }) => (
  <Box p="20" {...rest}>
    {children}
  </Box>
);

export const SectionLabel = ({ children }) => (
  <Text
    fontSize="xs"
    fontWeight="600"
    color="fg.tertiary"
    textTransform="uppercase"
    style={{ letterSpacing: '0.5px' }}
  >
    {children}
  </Text>
);

export const StatusMessage = ({ tone = 'success', children }) => {
  if (!children) return null;
  const color = tone === 'success' ? 'fg.success' : tone === 'error' ? 'fg.error' : 'fg.information';
  const Icon = tone === 'error' ? FaExclamationCircle : FaCheckCircle;
  return (
    <Flex alignItems="center" gap="8" color={color}>
      <Icon />
      <Text fontSize="sm" fontWeight="600" color={color}>
        {children}
      </Text>
    </Flex>
  );
};

