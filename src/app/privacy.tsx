import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { APP_NAME, DEVELOPER_NAME, PRIVACY_POLICY_EFFECTIVE_DATE, SUPPORT_EMAIL } from '@/constants/app-info';
import { MaxContentWidth, Spacing } from '@/constants/theme';
import { useTheme } from '@/hooks/use-theme';

const POLICY_SECTIONS = [
  {
    title: 'Information the app stores',
    body: [
      `${APP_NAME} stores your current game, win and loss statistics, streaks, guess distribution, and theme preference on your device.`,
      'This information is used only to keep the app working as expected between sessions.',
    ],
  },
  {
    title: 'Information the app does not collect',
    body: [
      `${APP_NAME} does not require an account and does not intentionally collect personal information such as your name, email address, location, contacts, photos, microphone input, or payment details.`,
      'The app does not include advertising, analytics, cloud sync, or social features in the current release.',
    ],
  },
  {
    title: 'How your data is used',
    body: [
      'Stored game data is used only to restore your progress, settings, and local statistics on the same device.',
      'Data is not sold or shared with third parties by the app in its current version.',
    ],
  },
  {
    title: 'Data retention and deletion',
    body: [
      'Locally stored data remains on your device until you clear it by uninstalling the app or resetting app storage.',
      'The in-app stats reset option clears gameplay statistics but may not remove every stored preference. Removing app data from Android settings removes the rest.',
    ],
  },
  {
    title: 'Children',
    body: [
      `${APP_NAME} is a general-audience word game and is not designed to knowingly collect personal information from children.`,
    ],
  },
  {
    title: 'Changes to this policy',
    body: [
      'If the app later adds analytics, ads, accounts, cloud features, or any new data collection, this privacy policy and the Google Play Data safety disclosure should be updated before that release goes live.',
    ],
  },
  {
    title: 'Contact',
    body: [
      `For privacy questions or support requests, contact ${SUPPORT_EMAIL}.`,
      `Developer name for publication: ${DEVELOPER_NAME}.`,
    ],
  },
];

export default function PrivacyPolicyScreen() {
  const theme = useTheme();

  return (
    <ThemedView style={[styles.container, { backgroundColor: theme.background }]}>
      <SafeAreaView style={styles.safeArea}>
        <ScrollView contentContainerStyle={styles.content}>
          <View style={styles.hero}>
            <ThemedText type="subtitle">Privacy Policy</ThemedText>
            <ThemedText themeColor="textSecondary">
              Effective date: {PRIVACY_POLICY_EFFECTIVE_DATE}
            </ThemedText>
            <ThemedText>
              This privacy policy explains how {APP_NAME} handles information for the current release.
            </ThemedText>
          </View>

          {POLICY_SECTIONS.map((section) => (
            <View key={section.title} style={styles.section}>
              <ThemedText type="smallBold">{section.title}</ThemedText>
              {section.body.map((paragraph) => (
                <ThemedText key={paragraph} themeColor="textSecondary">
                  {paragraph}
                </ThemedText>
              ))}
            </View>
          ))}
        </ScrollView>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
  },
  content: {
    width: '100%',
    maxWidth: MaxContentWidth,
    alignSelf: 'center',
    paddingHorizontal: Spacing.four,
    paddingVertical: Spacing.four,
    gap: Spacing.four,
  },
  hero: {
    gap: Spacing.two,
  },
  section: {
    gap: Spacing.two,
    padding: Spacing.three,
    borderRadius: 20,
    backgroundColor: 'rgba(127, 127, 127, 0.08)',
  },
});
