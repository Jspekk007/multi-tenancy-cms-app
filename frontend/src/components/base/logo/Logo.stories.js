import { Logo } from './Logo';
const meta = {
    title: 'UI/Logo',
    component: Logo,
    tags: ['autodocs'],
    argTypes: {
        assetType: {
            control: { type: 'select' },
            options: ['symbol', 'wordmark'],
            description: 'Defines which asset to render: Icon (symbol) or Text+Icon (wordmark).',
        },
        size: {
            control: { type: 'select' },
            options: ['small', 'medium', 'large', 'header'],
            description: 'Predefined size variant for the asset.',
        },
    },
    args: {
        assetType: 'symbol',
        alt: 'ATLAS Brand Mark',
        className: '',
    },
};
export default meta;
export const SymbolSmall = {
    name: 'Symbol (Icon) - Small',
    args: {
        assetType: 'symbol',
        size: 'small',
    },
};
export const SymbolMedium = {
    name: 'Symbol (Icon) - Medium',
    args: {
        assetType: 'symbol',
        size: 'medium',
    },
};
export const SymbolLarge = {
    name: 'Symbol (Icon) - Large',
    args: {
        assetType: 'symbol',
        size: 'large',
    },
};
export const WordmarkSmall = {
    name: 'Wordmark - Small',
    args: {
        assetType: 'wordmark',
        size: 'small',
        alt: 'ATLAS Wordmark Small',
    },
};
export const WordmarkMedium = {
    name: 'Wordmark - Medium',
    args: {
        assetType: 'wordmark',
        size: 'medium',
        alt: 'ATLAS Wordmark Medium',
    },
};
export const WordmarkLarge = {
    name: 'Wordmark - Large',
    args: {
        assetType: 'wordmark',
        size: 'large',
        alt: 'ATLAS Wordmark Large',
    },
};
export const WordmarkHeader = {
    name: 'Wordmark - Header Bar',
    args: {
        assetType: 'wordmark',
        size: 'header',
        alt: 'ATLAS CMS Header Logo',
    },
};
//# sourceMappingURL=Logo.stories.js.map