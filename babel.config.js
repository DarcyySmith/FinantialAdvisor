module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@/components': './src/components',
            '@/screens': './src/screens',
            '@/services': './src/services',
            '@/navigation': './src/navigation',
            '@/hooks': './src/hooks',
            '@/theme': './src/theme'
          }
        }
      ],
      'react-native-reanimated/plugin'
    ]
  };
};
