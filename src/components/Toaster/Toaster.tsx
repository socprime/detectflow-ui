import { Toaster as ToasterPrimitive } from '@socprime/react-ui';

export const Toaster = () => {
  return <ToasterPrimitive expand duration={Infinity} closeButton swipeDirections={['right']} />;
};
