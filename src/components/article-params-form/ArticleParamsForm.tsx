import { useState, useRef, useEffect } from 'react';
import clsx from 'clsx';

import { ArrowButton } from 'src/ui/arrow-button';
import { Button } from 'src/ui/button';
import { Select } from 'src/ui/select';
import { Separator } from 'src/ui/separator';
import { Text } from 'src/ui/text';
import {
	ArticleStateType,
	defaultArticleState,
	fontFamilyOptions,
	fontColors,
	backgroundColors,
	contentWidthArr,
	fontSizeOptions,
} from 'src/constants/articleProps';

import styles from './ArticleParamsForm.module.scss';

interface ArticleParamsFormProps {
	currentState: ArticleStateType;
	onApply: (newState: ArticleStateType) => void;
}

export const ArticleParamsForm = ({
	currentState,
	onApply,
}: ArticleParamsFormProps) => {
	const [isSidebarOpen, setIsSidebarOpen] = useState(false);
	const [localArticleState, setLocalArticleState] =
		useState<ArticleStateType>(currentState);

	const asideRef = useRef<HTMLElement>(null);
	const arrowButtonRef = useRef<HTMLDivElement>(null);

	// Закрытие по клику вне сайдбара и кнопки стрелки
	useEffect(() => {
		if (!isSidebarOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				asideRef.current &&
				!asideRef.current.contains(target) &&
				arrowButtonRef.current &&
				!arrowButtonRef.current.contains(target)
			) {
				setIsSidebarOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isSidebarOpen]);

	const handleChange = (
		field: keyof ArticleStateType,
		value: ArticleStateType[typeof field]
	) => {
		setLocalArticleState((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(localArticleState);
		setIsSidebarOpen(false);
	};

	const handleReset = () => {
		setLocalArticleState(defaultArticleState);
		onApply(defaultArticleState);
		setIsSidebarOpen(false);
	};

	return (
		<>
			<div ref={arrowButtonRef}>
				<ArrowButton
					isOpen={isSidebarOpen}
					onClick={() => setIsSidebarOpen(!isSidebarOpen)}
				/>
			</div>
			<aside
				ref={asideRef}
				className={clsx(styles.container, {
					[styles.container_open]: isSidebarOpen,
				})}>
				<form className={styles.form} onSubmit={handleSubmit}>
					<Text as='h2' size={31} weight={800} uppercase>
						Настройки
					</Text>

					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={localArticleState.fontFamilyOption}
						onChange={(option) => handleChange('fontFamilyOption', option)}
					/>

					<Select
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={localArticleState.fontSizeOption}
						onChange={(option) => handleChange('fontSizeOption', option)}
					/>

					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={localArticleState.fontColor}
						onChange={(option) => handleChange('fontColor', option)}
					/>
					<Separator />

					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={localArticleState.backgroundColor}
						onChange={(option) => handleChange('backgroundColor', option)}
					/>

					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={localArticleState.contentWidth}
						onChange={(option) => handleChange('contentWidth', option)}
					/>

					<div className={styles.bottomContainer}>
						<Button
							title='Сбросить'
							htmlType='button'
							type='clear'
							onClick={handleReset}
						/>
						<Button title='Применить' htmlType='submit' type='apply' />
					</div>
				</form>
			</aside>
		</>
	);
};
