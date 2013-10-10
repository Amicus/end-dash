class EndDashTemplateAggregator
  @@files = {}
  def aggregate!(opts = {})
    @templateDir = @pwd = opts[:templateDir] || "templates/"
    @aggregatedFilesDir = opts[:serveRoot] || File.dirname(__FILE__)
    @files = @@files
    loadFiles!
    writeFiles!
  end

  def loadFiles!
    currDir = Dir.new(@templateDir)
    raise "not files in #{@templateDir}" unless currDir.entries.length > 0
    parseDirectory!
  end

  def parseDirectory!
    dir = Dir.new(@pwd)
    dir.entries.each do |fileName|
      if fileName != "." && fileName != ".."
        if File.directory?(@pwd + fileName)
          handleDirectory!(fileName)
        else
          handleFile!(fileName)
        end
      end
    end
  end

  def handleFile!(fileName)
    fileStr = ""
    path = "#{@pwd}#{fileName}"
    File.open(path, "r").each_line do |line|
      fileStr = fileStr + line
    end
    @files[path.to_sym] = fileStr
  end

  def handleDirectory!(nextDir)
    oldDir = @pwd
    @pwd = "#{@pwd}#{nextDir}/"
    parseDirectory!
    @pwd = oldDir
  end

  def writeFiles!
    File.open("#{@aggregatedFilesDir}EndDashTemplates.js", 'w'){ |f|
      @files.each do |key, value|
        templateName = key.to_s.gsub(/.*templates\//, "")
        f.write("<script type='EndDash' name='#{templateName}'>\n")
        f.write(value)
        f.write("\n</script>\n")
      end
    }
  end

end

EndDashTemplateAggregator.new.aggregate!({
  templateDir: "/Users/TheOwner/Amicus/end-dash/test/support/templates/",
  serveRoot: "/Users/TheOwner/Amicus/end-dash/test/"
})