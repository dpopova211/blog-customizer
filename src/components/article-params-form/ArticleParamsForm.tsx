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
	const [isOpen, setIsOpen] = useState(false);
	const [formState, setFormState] = useState<ArticleStateType>(currentState);

	const asideRef = useRef<HTMLElement>(null);
	const arrowButtonRef = useRef<HTMLDivElement>(null);

	// При открытии сайдбара синхронизируем локальное состояние с актуальными настройками
	useEffect(() => {
		if (isOpen) {
			setFormState(currentState);
		}
	}, [isOpen, currentState]);

	// Закрытие по клику вне сайдбара и кнопки стрелки
	useEffect(() => {
		if (!isOpen) return;

		const handleClickOutside = (event: MouseEvent) => {
			const target = event.target as Node;
			if (
				asideRef.current &&
				!asideRef.current.contains(target) &&
				arrowButtonRef.current &&
				!arrowButtonRef.current.contains(target)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => document.removeEventListener('mousedown', handleClickOutside);
	}, [isOpen]);

	const handleChange = (field: keyof ArticleStateType, value: any) => {
		setFormState((prev) => ({ ...prev, [field]: value }));
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		onApply(formState);
		setIsOpen(false);
	};

	const handleReset = () => {
		setFormState(defaultArticleState);
		onApply(defaultArticleState);
		setIsOpen(false);
	};

	return (
		<>
			<div ref={arrowButtonRef}>
				<ArrowButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
			</div>
			<aside
				ref={asideRef}
				className={clsx(styles.container, { [styles.container_open]: isOpen })}>
				<form className={styles.form} onSubmit={handleSubmit}>
					<Text as='h2' size={31} weight={800} uppercase>
						Настройки
					</Text>
					<Separator />

					<Select
						title='Шрифт'
						options={fontFamilyOptions}
						selected={formState.fontFamilyOption}
						onChange={(option) => handleChange('fontFamilyOption', option)}
					/>

					<Select
						title='Размер шрифта'
						options={fontSizeOptions}
						selected={formState.fontSizeOption}
						onChange={(option) => handleChange('fontSizeOption', option)}
					/>

					<Select
						title='Цвет шрифта'
						options={fontColors}
						selected={formState.fontColor}
						onChange={(option) => handleChange('fontColor', option)}
					/>

					<Select
						title='Цвет фона'
						options={backgroundColors}
						selected={formState.backgroundColor}
						onChange={(option) => handleChange('backgroundColor', option)}
					/>

					<Select
						title='Ширина контента'
						options={contentWidthArr}
						selected={formState.contentWidth}
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
