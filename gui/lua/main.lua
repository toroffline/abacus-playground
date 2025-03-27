local numbers = {}
local currentIndex = 0
local totalNumbers = 0
local showStartScreen = true
local showResultScreen = false
local displayedNumbers = {}
local finalResult = 0
local font

function love.load()
    love.window.setTitle("Random Number Practice")
    love.window.setMode(600, 500)
    font = love.graphics.newFont(25)
    math.randomseed(os.time())  -- Seed the random generator
end

function love.keypressed(key)
    if showStartScreen then
        if key == "return" then
            generateNumbers()
            showStartScreen = false
        elseif tonumber(key) then
            totalNumbers = totalNumbers * 10 + tonumber(key)  -- Build number input
        elseif key == "backspace" then
            totalNumbers = math.floor(totalNumbers / 10)  -- Remove last digit
        end
    elseif showResultScreen then
        if key == "escape" then
            love.event.quit()
        end
    else
        if key == "space" then
            if currentIndex < #numbers then
                currentIndex = currentIndex + 1
                table.insert(displayedNumbers, numbers[currentIndex])
                finalResult = finalResult + numbers[currentIndex]  -- Add number to result
            else
                showResultScreen = true
            end
        elseif key == "escape" then
            love.event.quit()
        end
    end
end

function generateNumbers()
    if totalNumbers <= 0 then totalNumbers = 5 end  -- Default to 5 if no input
    numbers = {}
    finalResult = 0
    for i = 1, totalNumbers do
        table.insert(numbers, math.random(-20, 100))  -- Generate numbers (including negatives)
    end
    currentIndex = 1
    table.insert(displayedNumbers, numbers[currentIndex])
    finalResult = finalResult + numbers[currentIndex]  -- Add first number automatically
end

function love.draw()
    love.graphics.setFont(font)

    if showStartScreen then
        love.graphics.printf("Enter how many numbers:\n" .. totalNumbers .. "\nPress [ENTER] to start", 50, 150, 500, "center")

    elseif showResultScreen then
        love.graphics.printf("Final Result: " .. finalResult, 50, 50, 500, "center")
        love.graphics.printf("Press [ESC] to exit", 50, 400, 500, "center")

        -- Display the full list of numbers shown
        love.graphics.printf("Accepted Numbers:", 50, 100, 500, "left")
        for i, num in ipairs(displayedNumbers) do
            love.graphics.printf(num, 50, 120 + i * 30, 500, "left")
        end

    else
        if currentIndex > 0 then
            love.graphics.printf("Number: " .. numbers[currentIndex], 50, 150, 500, "center")
        else
            love.graphics.printf("Press [SPACE] to start!", 50, 150, 500, "center")
        end
        love.graphics.printf("Press [ESC] to Quit", 50, 400, 500, "center")

        -- Display the log of shown numbers
        love.graphics.printf("Accepted Numbers:", 50, 220, 500, "left")
        for i, num in ipairs(displayedNumbers) do
            love.graphics.printf(num, 50, 240 + i * 30, 500, "left")
        end
    end
end
