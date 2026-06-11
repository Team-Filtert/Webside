import type { AstroIntegration } from "astro";
import { unified } from '@astrojs/markdown-remark';
import rehypeExternalLinks, { type Target } from 'rehype-external-links';

interface Options {
    include: (string | RegExp)[];
    target?: Target;
}

function matches(path: string, rule: string | RegExp) {
  return typeof rule === 'string' ? path === rule || path.endsWith(rule) : rule.test(path);
}

function externalLinksForPages(opts: Options) {
    return () => function (tree: any, file: any) {
        const sourcePath = String(file.path ?? '');

        if (!opts.include.some((rule) => matches(sourcePath, rule))) return;

        return rehypeExternalLinks({
            target: opts.target ?? '_blank',
            rel: ['noopener', 'noreferrer'],
        })(tree);
    }
}

export default function scopedExternalLinks(opts: Options): AstroIntegration {
    return {
        name: 'scoped-external-links',
        hooks: {
            'astro:config:setup': ({ updateConfig, logger, config }) => {
                if (config.markdown?.processor) {
                    logger.warn('markdown.processer is already set, config will be overridden.')
                }

                updateConfig({
                    markdown: {
                        processor: unified({
                            rehypePlugins: [externalLinksForPages(opts)]
                        })
                    }
                })
            }
        }
    }
}
