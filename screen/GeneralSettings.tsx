import React, { useContext, useEffect, useState } from 'react';
import { Platform, ScrollView, StyleSheet } from 'react-native';

import { useNavigation } from '@react-navigation/native';
import { BlueCard, BlueLoading, BlueSpacing20, BlueText } from '../../BlueComponents';
import { BlueStorageContext } from '../../blue_modules/storage-context';
import { clearUseURv1, isURv1Enabled, setUseURv1 } from '../../blue_modules/ur';
import ListItem, { PressableWrapper } from '../../components/ListItem';
import { useTheme } from '../../components/themes';
import loc from '../../loc';

const styles = StyleSheet.create({
  root: {
    flex: 1,
  },
});

const GeneralSettings: React.FC = () => {
  const { isAdvancedModeEnabled, setIsAdvancedModeEnabled, wallets, isHandOffUseEnabled, setIsHandOffUseEnabledAsyncStorage } =
    useContext(BlueStorageContext);
  const [isLoading, setIsLoading] = useState(true);
  const [isAdvancedModeSwitchEnabled, setIsAdvancedModeSwitchEnabled] = useState(false);
  const [isURv1SwitchEnabled, setIsURv1SwitchEnabled] = useState(false);
  const { navigate } = useNavigation();
  const { colors } = useTheme();
  const onAdvancedModeSwitch = async (value: boolean) => {
    await setIsAdvancedModeEnabled(value);
    setIsAdvancedModeSwitchEnabled(value);
  };
  const onLegacyURv1Switch = async (value: boolean) => {
    setIsURv1SwitchEnabled(value);
    return value ? setUseURv1() : clearUseURv1();
  };

  useEffect(() => {
    (async () => {
      setIsAdvancedModeSwitchEnabled(await isAdvancedModeEnabled());
      setIsURv1SwitchEnabled(await isURv1Enabled());
      setIsLoading(false);
    })();
  });

  const navigateToPrivacy = () => {
    // @ts-ignore: Fix later
    navigate('SettingsPrivacy');
  };

  const stylesWithThemeHook = {
    root: {
      backgroundColor: colors.background,
    },
  };

  return isLoading ? (
    <BlueLoading />
  ) : (
    <ScrollView style={[styles.root, stylesWithThemeHook.root]}>
      {wallets.length > 1 && (
        <>
          {/* @ts-ignore: Fix later */}
          <ListItem onPress={() => navigate('DefaultView')} title={loc.settings.default_title} chevron />
        </>
      )}
      <ListItem title={loc.settings.privacy} onPress={navigateToPrivacy} testID="SettingsPrivacy" chevron />
      {Platform.OS === 'ios' ? (
        <>
          <ListItem
            hideChevron
            title={loc.settings.general_continuity}
            Component={PressableWrapper}
            switch={{ onValueChange: setIsHandOffUseEnabledAsyncStorage, value: isHandOffUseEnabled }}
          />
          <BlueCard>
            <BlueText>{loc.settings.general_continuity_e}</BlueText>
          </BlueCard>
          <BlueSpacing20 />
        </>
      ) : null}
      <ListItem
        Component={PressableWrapper}
        title={loc.settings.general_adv_mode}
        switch={{ onValueChange: onAdvancedModeSwitch, value: isAdvancedModeSwitchEnabled, testID: 'AdvancedMode' }}
      />
      <BlueCard>
        <BlueText>{loc.settings.general_adv_mode_e}</BlueText>
      </BlueCard>
      <BlueSpacing20 />
      <ListItem
        Component={PressableWrapper}
        title="Legacy URv1 QR"
        switch={{ onValueChange: onLegacyURv1Switch, value: isURv1SwitchEnabled }}
      />
      <BlueSpacing20 />
    </ScrollView>
  );
};

export default GeneralSettings;