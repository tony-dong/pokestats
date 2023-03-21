// Button.stories.js|jsx

import React from 'react';
import { ComponentStory, ComponentMeta } from '@storybook/react';
import EverythingDecorator from '../../../.storybook/decorators/EverythingDecorator';

import {
  DARWIN_MOCK_TOURNAMENT,
  SYDNEY_MOCK_TOURNAMENT,
} from '../../../tests/mocks';
import { PlayerProfilePage, PlayerProfilePageProps } from './PlayerProfilePage';

export default {
  component: PlayerProfilePage,
  decorators: [EverythingDecorator],
};
//👇 We create a “template” of how args map to rendering
const Template: ComponentStory<typeof PlayerProfilePage> = (args: PlayerProfilePageProps) => (
  <PlayerProfilePage {...args} />
);

export const MyProfile = Template.bind({});
MyProfile.args = {
  profile: {
    id: 'jared',
    name: 'Jared Grimes',
    username: 'jared',
    email: '',
    image: '',
  },
};